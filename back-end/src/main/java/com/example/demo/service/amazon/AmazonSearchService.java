package com.example.demo.service.amazon;

import com.example.demo.model.dto.ListingResponse;
import com.example.demo.model.dto.VehicleSearchRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AmazonSearchService {

    /**
     * Keyword search
     */
    public List<ListingResponse> search(String query) {

        return List.of(

                ListingResponse.builder()
                        .title("Brake Pads - Honda Accord (Amazon)")
                        .source("AMAZON")
                        .price(82.50)
                        .shippingCost(0.0)
                        .totalPrice(82.50)
                        .productUrl("https://www.amazon.com/mock-item-1")
                        .imageUrl("https://images.unsplash.com/photo-1607860108855-64acf2078ed9")
                        .availability("In Stock")
                        .build(),

                ListingResponse.builder()
                        .title("Premium Ceramic Brake Pads (Amazon)")
                        .source("AMAZON")
                        .price(89.99)
                        .shippingCost(0.0)
                        .totalPrice(89.99)
                        .productUrl("https://www.amazon.com/mock-item-2")
                        .imageUrl("https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80")
                        .availability("In Stock")
                        .build()
        );
    }

    /**
     * Vehicle search
     */
    public List<ListingResponse> searchWithVehicle(
            VehicleSearchRequest request,
            String query
    ) {

        String vehicleQuery =
                request.getYear() + " " +
                        request.getMake() + " " +
                        request.getModel() + " " +
                        request.getPart();

        return search(vehicleQuery);
    }
}