# Effective Temperature Equation for Hourly Temperatures

## Background

The daily effective temperature formula incorporates current and lagged daily maximum temperatures with exponentially decreasing weights:

\[
T_{eff,daily} = 0.7 \cdot T_{max} + 0.003 \cdot T_{max-1} + 0.002 \cdot T_{max-2}
\]

where:
- \(T_{max}\) = today's maximum temperature
- \(T_{max-1}\) = yesterday's maximum temperature
- \(T_{max-2}\) = maximum temperature from two days ago

## Pattern Analysis

The coefficients follow a decreasing pattern:
- Current period (day 0): 0.7
- Lag 1 (day -1): 0.003
- Lag 2 (day -2): 0.002

The decay ratio between lags suggests a non-uniform attenuation, where the most recent lag (day -1) has a much smaller coefficient than the current day.

## Hourly Effective Temperature Equation

### Option 1: Direct Hourly Adaptation (Recommended)

Scaling the daily structure to hourly intervals:

\[
T_{eff,hourly} = 0.7 \cdot T_h + 0.003 \cdot T_{h-1} + 0.002 \cdot T_{h-2}
\]

where:
- \(T_h\) = current hour's temperature
- \(T_{h-1}\) = previous hour's temperature
- \(T_{h-2}\) = temperature from two hours ago

**Advantages:**
- Maintains the same weighting structure
- Simple to implement
- Natural correspondence between temporal scales
- 3-hour memory window is reasonable for hourly data

### Option 2: Extended Historical Context (Alternative)

For longer-term hourly memory:

\[
T_{eff,hourly} = 0.7 \cdot T_h + 0.003 \cdot T_{h-24} + 0.002 \cdot T_{h-48}
\]

where:
- \(T_h\) = current hour's temperature
- \(T_{h-24}\) = temperature from 24 hours ago (yesterday, same hour)
- \(T_{h-48}\) = temperature from 48 hours ago (two days ago, same hour)

**Advantages:**
- Maintains daily periodicity
- Captures day-to-day patterns
- Useful for circadian or seasonal effects
- More directly analogous to the daily formula

### Option 3: Multi-Lag Hourly Model (Enhanced)

For finer temporal resolution:

\[
T_{eff,hourly} = 0.7 \cdot T_h + 0.003 \cdot T_{h-1} + 0.002 \cdot T_{h-2} + 0.001 \cdot T_{h-3} + 0.0005 \cdot T_{h-4}
\]

**Advantages:**
- Captures more granular short-term effects
- Smoother transition between hours
- Exponentially decaying weights provide flexible memory

## Recommendation

**Use Option 1** for most applications involving hourly temperature data, as it:
- Provides a natural temporal scaling from daily to hourly intervals
- Maintains simplicity with only current and two recent lags
- Offers computational efficiency
- Is interpretable and easy to implement

**Use Option 2** if your application requires:
- Day-to-day consistency (e.g., weather patterns repeating diurnally)
- Modeling of circadian temperature cycles
- Comparison with daily effective temperature calculations

## Implementation Notes

- Ensure temperature data is quality-controlled (no missing values in lag periods)
- Consider edge cases: at the start of data collection, insufficient historical data exists for full calculation
- For initialization, you may use available historical data or apply adaptive windowing
- Units should remain consistent (e.g., all Celsius or all Fahrenheit)

## Example Calculation (Option 1)

Given hourly temperatures:
- Current hour: 22°C
- One hour ago: 21°C
- Two hours ago: 20°C

\[
T_{eff,hourly} = 0.7(22) + 0.003(21) + 0.002(20) = 15.4 + 0.063 + 0.04 = 15.503°C
\]
