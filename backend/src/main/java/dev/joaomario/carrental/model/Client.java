package dev.joaomario.carrental.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clients")
public class Client extends User {

    @Column(nullable = false, unique = true)
    private String rg;

    @Column(nullable = false, unique = true)
    private String cpf;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String profession;

    @ElementCollection
    @CollectionTable(name = "client_employments", joinColumns = @JoinColumn(name = "client_id"))
    private List<Employment> employments = new ArrayList<>();

    protected Client() {
    }

    public Client(String username, String passwordHash, String name, String rg, String cpf, String address,
                  String profession, List<Employment> employments) {
        super(username, passwordHash, name);
        this.rg = rg;
        this.cpf = cpf;
        this.address = address;
        this.profession = profession;
        this.employments = new ArrayList<>(employments);
    }

    @Override
    public Role getRole() {
        return Role.CLIENT;
    }

    public String getRg() {
        return rg;
    }

    public void setRg(String rg) {
        this.rg = rg;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

    public List<Employment> getEmployments() {
        return employments;
    }

    public void setEmployments(List<Employment> employments) {
        this.employments.clear();
        this.employments.addAll(employments);
    }
}
