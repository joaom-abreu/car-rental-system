package dev.joaomario.carrental.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "automobiles")
public class Automobile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String registration;

    @Column(nullable = false)
    private int year;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false, unique = true)
    private String plate;

    @ManyToOne(optional = false)
    @JoinColumn(name = "owner_id")
    private User owner;

    protected Automobile() {
    }

    public Automobile(String registration, int year, String brand, String model, String plate, User owner) {
        this.registration = registration;
        this.year = year;
        this.brand = brand;
        this.model = model;
        this.plate = plate;
        this.owner = owner;
    }

    public Long getId() {
        return id;
    }

    public String getRegistration() {
        return registration;
    }

    public void setRegistration(String registration) {
        this.registration = registration;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getPlate() {
        return plate;
    }

    public void setPlate(String plate) {
        this.plate = plate;
    }

    public User getOwner() {
        return owner;
    }
}
