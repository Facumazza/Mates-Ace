package com.matesace.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(nullable = false)
    private Double total;

    @Column(nullable = false)
    private String channel;

    @Column(nullable = false)
    private String status = "pendiente";

    @Column(nullable = false)
    private Instant date = Instant.now();

    private String preferenceId;

    private String shippingFirstName;
    private String shippingLastName;
    private String shippingPhone;
    private String shippingAddress;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getDate() { return date; }
    public void setDate(Instant date) { this.date = date; }
    public String getPreferenceId() { return preferenceId; }
    public void setPreferenceId(String preferenceId) { this.preferenceId = preferenceId; }
    public String getShippingFirstName() { return shippingFirstName; }
    public void setShippingFirstName(String v) { this.shippingFirstName = v; }
    public String getShippingLastName() { return shippingLastName; }
    public void setShippingLastName(String v) { this.shippingLastName = v; }
    public String getShippingPhone() { return shippingPhone; }
    public void setShippingPhone(String v) { this.shippingPhone = v; }
    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String v) { this.shippingAddress = v; }
    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
}
