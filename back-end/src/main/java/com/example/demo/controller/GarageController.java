package com.example.demo.controller;

import com.example.demo.model.entity.GarageVehicle;
import com.example.demo.service.garage.GarageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/garage")
@CrossOrigin
public class GarageController {

    private final GarageService garageService;

    public GarageController(GarageService garageService) {
        this.garageService = garageService;
    }

    @PostMapping
    public GarageVehicle saveVehicle(
            @RequestBody GarageVehicle vehicle
    ) {
        return garageService.saveVehicle(vehicle);
    }

    @GetMapping("/{garageId}")
    public List<GarageVehicle> getGarage(
            @PathVariable String garageId
    ) {
        return garageService.getGarage(garageId);
    }

    @DeleteMapping("/{id}")
    public void deleteVehicle(
            @PathVariable Long id
    ) {
        garageService.deleteVehicle(id);
    }
}