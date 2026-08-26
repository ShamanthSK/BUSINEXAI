"""
Shared Python Currency and Metric Formatter Utility
Provides dynamic scaling for Cr (Crores), L (Lakhs), k (Thousands), and base INR values.
"""

def format_currency(value: float) -> str:
    if value is None:
        return "₹0"
    try:
        val = float(value)
    except (ValueError, TypeError):
        return str(value)

    abs_val = abs(val)
    sign = "-" if val < 0 else ""

    if abs_val >= 1e7:
        return f"{sign}₹{abs_val / 1e7:.2f} Cr"
    elif abs_val >= 1e5:
        return f"{sign}₹{abs_val / 1e5:.2f} L"
    elif abs_val >= 1e3:
        return f"{sign}₹{abs_val:,.0f}"
    else:
        return f"{sign}₹{abs_val:,.2f}"
