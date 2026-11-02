package dev.joaomario.carrental.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "credit_contracts")
public class CreditContract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "bank_id")
    private Agent bank;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private BigDecimal monthlyInterestRate;

    @Column(nullable = false)
    private int installments;

    protected CreditContract() {
    }

    public CreditContract(Agent bank, BigDecimal amount, BigDecimal monthlyInterestRate, int installments) {
        this.bank = bank;
        this.amount = amount;
        this.monthlyInterestRate = monthlyInterestRate;
        this.installments = installments;
    }

    public Agent getBank() {
        return bank;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public BigDecimal getMonthlyInterestRate() {
        return monthlyInterestRate;
    }

    public int getInstallments() {
        return installments;
    }
}
