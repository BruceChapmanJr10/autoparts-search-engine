package com.example.demo.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String searchQuery;

    private String title;

    private String source;

    private Double price;

    private Double shippingCost;

    private Double totalPrice;

    @Column(unique = true)
    private String productUrl;

    // 🔥 ADD THIS
    private String imageUrl;

    private String availability;

    private Long lastUpdated;

    private Integer year;

    private String make;

    private String model;

    @Column(name = "year_start")
    private Integer yearStart;

    @Column(name = "year_end")
    private Integer yearEnd;

    @OneToMany(
            mappedBy = "listing",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ListingFitment> fitments;
}