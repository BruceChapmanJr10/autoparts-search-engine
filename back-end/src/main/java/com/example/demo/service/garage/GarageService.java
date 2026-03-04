package com.example.demo.service.garage;

import com.example.demo.model.entity.GarageVehicle;
import com.example.demo.repository.GarageVehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GarageService {

    private final GarageVehicleRepository repository;

    public GarageService(GarageVehicleRepository repository) {
        this.repository = repository;
    }

    public void deleteVehicle(Long id) {
        repository.deleteById(id);
    }

    // Save vehicle to garage
    public GarageVehicle saveVehicle(GarageVehicle vehicle) {

        List<GarageVehicle> existing =
                repository.findByGarageId(vehicle.getGarageId());

        boolean alreadyExists = existing.stream().anyMatch(v ->
                v.getYear().equals(vehicle.getYear()) &&
                        v.getMake().equalsIgnoreCase(vehicle.getMake()) &&
                        v.getModel().equalsIgnoreCase(vehicle.getModel()) &&
                        ((v.getTrim() == null && vehicle.getTrim() == null) ||
                                (v.getTrim() != null && v.getTrim().equalsIgnoreCase(vehicle.getTrim()))) &&
                        ((v.getEngine() == null && vehicle.getEngine() == null) ||
                                (v.getEngine() != null && v.getEngine().equalsIgnoreCase(vehicle.getEngine())))
        );

        if (alreadyExists) {
            return existing.stream()
                    .filter(v ->
                            v.getYear().equals(vehicle.getYear()) &&
                                    v.getMake().equalsIgnoreCase(vehicle.getMake()) &&
                                    v.getModel().equalsIgnoreCase(vehicle.getModel()))
                    .findFirst()
                    .orElseThrow();
        }

        vehicle.setCreatedAt(System.currentTimeMillis());

        return repository.save(vehicle);
    }

    // Get all vehicles in a garage
    public List<GarageVehicle> getGarage(String garageId) {
        return repository.findByGarageId(garageId);
    }
}
