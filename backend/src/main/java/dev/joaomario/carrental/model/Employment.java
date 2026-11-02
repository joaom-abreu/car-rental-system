package dev.joaomario.carrental.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.math.BigDecimal;

@Embeddable
public class Employment {

    @Column(nullable = false)
    private String employer;

    @Column(nullable = false)
    private BigDecimal income;

    protected Employment() {
    }

    public Employment(String employer, BigDecimal income) {
        this.employer = employer;
        this.income = income;
    }

    public String getEmployer() {
        return employer;
    }

    public BigDecimal getIncome() {
        return income;
    }
}
