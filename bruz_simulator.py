# -*- coding: utf-8 -*-
"""
Bruz Investment Simulator (CLI)

Edit the variables below, then run:
    python bruz_simulator.py

Outputs: monthly payment, DTI, projected values 5/10 years, IRR nominal & real.
"""

import math

def monthly_payment(P, annual_rate, years):
    i = annual_rate/12
    n = years*12
    return P * i / (1 - (1+i)**(-n))

def outstanding_balance(P, annual_rate, years, months_paid):
    i = annual_rate/12
    A = monthly_payment(P, annual_rate, years)
    k = months_paid
    return P*(1+i)**k - A*((1+i)**k - 1)/i

def irr_bisection(cashflows, low=-0.9, high=1.0, tol=1e-7, max_iter=10000):
    def npv(rate):
        return sum(cf / ((1+rate)**t) for t, cf in enumerate(cashflows))
    f_low = npv(low)
    f_high = npv(high)
    h = high
    tries = 0
    while f_low * f_high > 0 and tries < 50:
        h += 1.0
        f_high = npv(h)
        tries += 1
    if f_low * f_high > 0:
        return None
    for _ in range(max_iter):
        mid = (low + h)/2
        f_mid = npv(mid)
        if abs(f_mid) < tol:
            return mid
        if f_low * f_mid < 0:
            h = mid
            f_high = f_mid
        else:
            low = mid
            f_low = f_mid
    return mid

def real_irr(nominal, inflation):
    return (1+nominal)/(1+inflation)-1

# ==== Parameters (edit) ====
price = 200000.0
area = 57.0
apport = 50000.0
income_net = 2200.0
fees_pct = 0.08
rate = 0.0329
years = 25
assur_rate = 0.0015
rent_pm2 = 15.0
charges_pct = 0.3
vacancy_pct = 0.0
growth_base = 0.025
growth_best = 0.045
inflation = 0.02
sell_cost_pct = 0.07
# Variant: set loan amount explicitly (ex: 166000). If None, compute as price - (apport - fees)
loan_amount = None
# ============================

fees = price*fees_pct
if loan_amount is None:
    loan_amount = price - (apport - fees)

pay = monthly_payment(loan_amount, rate, years)
assur_month = loan_amount*assur_rate/12
monthly_total = pay + assur_month
dti = monthly_total / income_net

gross_rent_y = area*rent_pm2*12*(1 - vacancy_pct)
noi_y = gross_rent_y*(1 - charges_pct)

def irr_10y(loan, noi, growth, sell_cost, cash_initial):
    annual_debt = (pay + assur_month)*12
    bal_120 = outstanding_balance(loan, rate, years, 120)
    sale_price = price*((1+growth)**10)
    sale_net = sale_price*(1 - sell_cost)
    final_net = sale_net - bal_120
    cf = [-cash_initial] + [-annual_debt]*5 + [-annual_debt + noi]*4 + [-annual_debt + noi + final_net]
    irr_nom = irr_bisection(cf)
    irr_real = real_irr(irr_nom, inflation) if irr_nom is not None else None
    return irr_nom, irr_real

irr_base_nom, irr_base_real = irr_10y(loan_amount, noi_y, growth_base, sell_cost_pct, apport)

print("=== Résultats ===")
print(f"Montant du prêt: {loan_amount:,.0f} €")
print(f"Mensualité P&I: {pay:,.2f} € ; Assurance: {assur_month:,.2f} € ; Total: {monthly_total:,.2f} €")
print(f"Taux d'endettement (DTI): {dti*100:.2f} %")
print(f"Valeur projetée à 5 ans (Base): {price*((1+growth_base)**5):,.0f} €")
print(f"Valeur projetée à 10 ans (Base): {price*((1+growth_base)**10):,.0f} €")
print(f"Loyer annuel net (charges {charges_pct*100:.0f}%): {noi_y:,.0f} €")
print(f"IRR nominale 10 ans (Base): {irr_base_nom*100:.2f} % ; IRR réelle (inflation {inflation*100:.1f}%): {irr_base_real*100:.2f} %")
