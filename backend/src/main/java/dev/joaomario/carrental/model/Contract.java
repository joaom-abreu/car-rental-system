package dev.joaomario.carrental.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "contracts")
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "rental_request_id", unique = true)
    private RentalRequest rentalRequest;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OwnershipType ownershipType;

    @ManyToOne(optional = false)
    @JoinColumn(name = "signed_by_id")
    private Agent signedBy;

    @Column(nullable = false)
    private Instant signedAt;

    @OneToOne
    @JoinColumn(name = "credit_contract_id", unique = true)
    private CreditContract creditContract;

    protected Contract() {
    }

    public Contract(RentalRequest rentalRequest, OwnershipType ownershipType, Agent signedBy,
                    CreditContract creditContract) {
        this.rentalRequest = rentalRequest;
        this.ownershipType = ownershipType;
        this.signedBy = signedBy;
        this.creditContract = creditContract;
        this.signedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public OwnershipType getOwnershipType() {
        return ownershipType;
    }

    public Agent getSignedBy() {
        return signedBy;
    }

    public Instant getSignedAt() {
        return signedAt;
    }

    public CreditContract getCreditContract() {
        return creditContract;
    }
}
