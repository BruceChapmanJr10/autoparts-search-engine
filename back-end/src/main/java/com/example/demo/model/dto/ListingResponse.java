package com.example.demo.model.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ListingResponse {

    private String title;

    private String source;

    private double price;

    private double shippingCost;

    private double totalPrice;

    private String productUrl;

    private String imageUrl;

    private String availability;

    private boolean exactMatch;
}