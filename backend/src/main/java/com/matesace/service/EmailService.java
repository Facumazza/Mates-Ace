package com.matesace.service;

import com.matesace.entity.Order;
import com.matesace.entity.OrderItem;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.util.Locale;
import java.util.Map;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${mail.from:noreply@matesace.com}")
    private String from;

    private static final Map<String, String> STATUS_MESSAGES = Map.of(
            "procesando", "Tu pago fue confirmado y estamos preparando tu pedido.",
            "enviado",    "Tu pedido ya está en camino. ¡Pronto lo tendrás!",
            "completado", "Tu pedido fue entregado. ¡Gracias por tu compra!",
            "cancelado",  "Tu pedido fue cancelado. Si tenés dudas, contactanos."
    );

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOrderConfirmation(Order order) {
        String to = order.getShippingEmail();
        if (to == null || to.isBlank()) return;
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject("¡Tu pedido #" + order.getId() + " fue recibido! - Mates Ace");
            helper.setText(buildConfirmationHtml(order), true);
            mailSender.send(msg);
        } catch (Exception e) {
            // No interrumpir el flujo si el email falla
        }
    }

    public void sendStatusUpdate(Order order) {
        String to = order.getShippingEmail();
        if (to == null || to.isBlank()) return;
        String message = STATUS_MESSAGES.get(order.getStatus());
        if (message == null) return;
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject("Pedido #" + order.getId() + ": " + capitalize(order.getStatus()) + " - Mates Ace");
            helper.setText(buildStatusHtml(order, message), true);
            mailSender.send(msg);
        } catch (Exception e) {
            // No interrumpir el flujo si el email falla
        }
    }

    public void sendTransferInstructions(Order order, Map<String, Object> bankInfo) {
        String to = order.getShippingEmail();
        if (to == null || to.isBlank()) return;
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject("Datos para tu transferencia - Pedido #" + order.getId() + " - Mates Ace");
            helper.setText(buildTransferHtml(order, bankInfo), true);
            mailSender.send(msg);
        } catch (Exception e) {
            // No interrumpir el flujo si el email falla
        }
    }

    private String buildTransferHtml(Order order, Map<String, Object> bankInfo) {
        String cvu    = String.valueOf(bankInfo.getOrDefault("cvu", ""));
        String alias  = String.valueOf(bankInfo.getOrDefault("alias", ""));
        String bank   = String.valueOf(bankInfo.getOrDefault("bank", ""));
        String holder = String.valueOf(bankInfo.getOrDefault("holder", ""));
        return baseTemplate("""
            <h2 style="color:#4a5c2f;font-size:22px;margin:0 0 8px;">¡Pedido recibido!</h2>
            <p style="color:#666;font-size:15px;margin:0 0 24px;">
              Hola %s, recibimos tu pedido. Para confirmarlo, realizá la transferencia con los siguientes datos.
              Una vez que acreditemos el pago, te notificamos y preparamos tu envío.
            </p>
            <div style="background:#f9f7f2;border-radius:12px;padding:20px;margin-bottom:16px;">
              <p style="margin:0 0 12px;font-size:12px;color:#999;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Datos bancarios</p>
              <table width="100%%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:6px 0;font-size:14px;color:#888;">Banco</td>       <td style="padding:6px 0;font-size:14px;color:#1a1a1a;font-weight:600;">%s</td></tr>
                <tr><td style="padding:6px 0;font-size:14px;color:#888;">Titular</td>     <td style="padding:6px 0;font-size:14px;color:#1a1a1a;font-weight:600;">%s</td></tr>
                <tr><td style="padding:6px 0;font-size:14px;color:#888;">CVU</td>         <td style="padding:6px 0;font-size:14px;color:#1a1a1a;font-weight:600;font-family:monospace;">%s</td></tr>
                <tr><td style="padding:6px 0;font-size:14px;color:#888;">Alias</td>       <td style="padding:6px 0;font-size:14px;color:#1a1a1a;font-weight:600;">%s</td></tr>
                <tr><td style="padding:6px 0;font-size:14px;color:#888;">Referencia</td>  <td style="padding:6px 0;font-size:14px;color:#1a1a1a;font-weight:600;">Pedido #%d</td></tr>
                <tr><td colspan="2" style="border-top:1px solid #e8e0d0;padding-top:10px;"></td></tr>
                <tr>
                  <td style="padding:8px 0;font-weight:700;font-size:15px;color:#1a1a1a;">Total a transferir</td>
                  <td style="padding:8px 0;font-weight:700;font-size:15px;color:#4a5c2f;text-align:right;">%s</td>
                </tr>
              </table>
            </div>
            <p style="color:#999;font-size:13px;margin:0;">
              En el concepto de la transferencia podés poner el número de pedido para ayudarnos a identificarla más rápido.
            </p>
            """.formatted(
                order.getShippingFirstName() != null ? order.getShippingFirstName() : "",
                bank, holder, cvu, alias,
                order.getId(),
                formatPrice(order.getTotal())
        ));
    }

    private String buildConfirmationHtml(Order order) {
        StringBuilder rows = new StringBuilder();
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                rows.append("""
                    <tr>
                      <td style="padding:8px 0;color:#3d3d3d;font-size:14px;">%s × %d</td>
                      <td style="padding:8px 0;color:#3d3d3d;font-size:14px;text-align:right;font-weight:600;">%s</td>
                    </tr>
                    """.formatted(item.getProductName(), item.getQuantity(), formatPrice(item.getSubtotal())));
            }
        }
        return baseTemplate("""
            <h2 style="color:#4a5c2f;font-size:22px;margin:0 0 8px;">¡Recibimos tu pedido!</h2>
            <p style="color:#666;font-size:15px;margin:0 0 24px;">Hola %s, gracias por tu compra. Vamos a avisarte cuando tu pedido esté en camino.</p>
            <div style="background:#f9f7f2;border-radius:12px;padding:20px;margin-bottom:24px;">
              <p style="margin:0 0 12px;font-size:12px;color:#999;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Resumen del pedido #%d</p>
              <table width="100%%" cellpadding="0" cellspacing="0">
                %s
                <tr><td colspan="2" style="border-top:1px solid #e8e0d0;padding-top:10px;"></td></tr>
                <tr>
                  <td style="padding:8px 0;font-weight:700;font-size:15px;color:#1a1a1a;">Total</td>
                  <td style="padding:8px 0;font-weight:700;font-size:15px;color:#1a1a1a;text-align:right;">%s</td>
                </tr>
              </table>
            </div>
            <div style="background:#f9f7f2;border-radius:12px;padding:20px;">
              <p style="margin:0 0 8px;font-size:12px;color:#999;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Datos de envío</p>
              <p style="margin:0;font-size:14px;color:#3d3d3d;">%s %s<br>%s<br>%s</p>
            </div>
            """.formatted(
                order.getShippingFirstName() != null ? order.getShippingFirstName() : "",
                order.getId(),
                rows,
                formatPrice(order.getTotal()),
                order.getShippingFirstName() != null ? order.getShippingFirstName() : "",
                order.getShippingLastName() != null ? order.getShippingLastName() : "",
                order.getShippingPhone() != null ? order.getShippingPhone() : "",
                order.getShippingAddress() != null ? order.getShippingAddress() : ""
        ));
    }

    private String buildStatusHtml(Order order, String message) {
        return baseTemplate("""
            <h2 style="color:#4a5c2f;font-size:22px;margin:0 0 8px;">Actualización de tu pedido</h2>
            <p style="color:#666;font-size:15px;margin:0 0 24px;">Hola %s, hay novedades sobre tu pedido.</p>
            <div style="background:#f9f7f2;border-radius:12px;padding:20px;margin-bottom:24px;">
              <p style="margin:0 0 6px;font-size:12px;color:#999;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Pedido #%d</p>
              <p style="margin:0;font-size:16px;font-weight:700;color:#4a5c2f;">%s</p>
            </div>
            <p style="color:#555;font-size:15px;">%s</p>
            """.formatted(
                order.getShippingFirstName() != null ? order.getShippingFirstName() : "",
                order.getId(),
                capitalize(order.getStatus()),
                message
        ));
    }

    private String baseTemplate(String content) {
        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="margin:0;padding:0;background:#f0ece4;font-family:Georgia,serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f0ece4;padding:40px 20px;">
                <tr><td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%%;">
                    <tr>
                      <td style="background:#1a1a1a;padding:24px 32px;border-radius:16px 16px 0 0;text-align:center;">
                        <span style="color:#c8b97a;font-size:22px;font-weight:700;letter-spacing:2px;">MATES ACE</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="background:#ffffff;padding:32px;border-radius:0 0 16px 16px;">
                        %s
                        <hr style="border:none;border-top:1px solid #f0ece4;margin:24px 0;">
                        <p style="color:#aaa;font-size:12px;text-align:center;margin:0;">
                          Mates Ace · Argentina<br>
                          Si no realizaste esta compra, ignorá este mensaje.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td></tr>
              </table>
            </body>
            </html>
            """.formatted(content);
    }

    private String formatPrice(Double amount) {
        if (amount == null) return "$0";
        return "$" + NumberFormat.getNumberInstance(new Locale("es", "AR")).format(amount.longValue());
    }

    private String capitalize(String s) {
        if (s == null || s.isEmpty()) return s;
        return s.substring(0, 1).toUpperCase() + s.substring(1);
    }
}
