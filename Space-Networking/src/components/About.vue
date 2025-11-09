<script setup lang="ts">
import Simulation from "./Simulation.vue";
import { SimpleLineScenario, TestDataScenario } from "../lib/simulator/scenarios/index";

// Tabs imports kept in case they're used at a higher level
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";

// MathJax should be configured in index.html or a layout-level component.
// No <script> tags here to avoid Vite "side effect" warnings.
</script>

<template>
  <div class="howit-page">
    <div class="howit-wrap">
      <h1 class="howit-title">Kinetic Simulator — What it Computes and How</h1>

      <h2 class="howit-heading">Constants &amp; Units</h2>
      <div class="howit-grid howit-cols-2">
        <div class="howit-card">
          <h3 class="howit-subheading">Canonical Heliocentric Distances (km)</h3>
          <table class="howit-table">
            <thead>
              <tr>
                <th>Body</th>
                <th>Distance from Sun, d (km)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Mercury</td><td>58 × 10<sup>6</sup></td></tr>
              <tr><td>Venus</td><td>109 × 10<sup>6</sup></td></tr>
              <tr><td>Earth</td><td>150 × 10<sup>6</sup></td></tr>
              <tr><td>Mars</td><td>228 × 10<sup>6</sup></td></tr>
              <tr><td>Jupiter</td><td>778 × 10<sup>6</sup></td></tr>
              <tr><td>Saturn</td><td>1.4 × 10<sup>9</sup></td></tr>
              <tr><td>Uranus</td><td>2.9 × 10<sup>9</sup></td></tr>
              <tr><td>Neptune</td><td>4.5 × 10<sup>9</sup></td></tr>
            </tbody>
          </table>
        </div>

        <div class="howit-card">
          <h3 class="howit-subheading">Gravitational Parameters (μ = GM) (km³/s²)</h3>
          <table class="howit-table">
            <thead>
              <tr>
                <th>Primary</th>
                <th>μ</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Sun</td><td>1.327 × 10<sup>11</sup></td></tr>
              <tr><td>Mercury</td><td>22,031.868551</td></tr>
              <tr><td>Venus</td><td>324,858.592000</td></tr>
              <tr><td>Earth</td><td>398,600.435507</td></tr>
              <tr><td>Mars</td><td>42,828.375816</td></tr>
              <tr><td>Jupiter</td><td>126,712,764.10</td></tr>
              <tr><td>Saturn</td><td>37,940,584.8418</td></tr>
              <tr><td>Uranus</td><td>5,794,556.40</td></tr>
              <tr><td>Neptune</td><td>6,836,527.10058</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="howit-grid">
        <div class="howit-card">
          <h3 class="howit-subheading">Other Constants</h3>
          <table class="howit-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Symbol</th>
                <th>Value</th>
                <th>Units</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Speed of light (for comms, not orbital dynamics)</td>
                <td>c</td>
                <td>299,792</td>
                <td>km/s</td>
              </tr>
              <tr>
                <td>Generic loss rate (for comms models)</td>
                <td>—</td>
                <td>0.01</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2 class="howit-heading">Algorithm Summary (Step-by-Step)</h2>
      <div class="howit-card">
        <ol class="howit-list">
          <li>
            <strong>Construct space bodies:</strong>
            Each has <code>id</code>, <code>name</code>, and an initial <code>Position(x₀, y₀)</code>.
          </li>
          <li>
            <strong>Construct orbiters:</strong>
            For a chosen radius r around a primary, compute v = √(μ/r) and set ω = v/r.
            If orbiting the Sun, seed at (d, 0); otherwise place at θ₀ = 0 relative to the parent.
          </li>
          <li>
            <strong>Order bodies:</strong>
            Sun → planets → others so that primaries update before dependents.
          </li>
          <li>
            <strong>Iterate time:</strong>
            For t = 1…T−1, each orbiter reads the parent’s previous and current positions,
            computes θₜ₊₁, and writes (xₜ₊₁, yₜ₊₁); non-orbiter bodies are handled accordingly.
          </li>
        </ol>
      </div>

      <h2 class="howit-heading">Numeric Update (Single Step)</h2>
      <div class="howit-card">
        <table class="howit-table">
          <thead>
            <tr>
              <th>Quantity</th>
              <th>Symbol</th>
              <th>Computation</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Speed</td>
              <td>v</td>
              <td>v = √(μ / r)</td>
              <td>μ from table, r in km</td>
            </tr>
            <tr>
              <td>Angular rate</td>
              <td>ω</td>
              <td>ω = v / r</td>
              <td>rad/s (Δt = 1 in sim units)</td>
            </tr>
            <tr>
              <td>Previous angle</td>
              <td>θₜ</td>
              <td>
                θₜ = atan2(
                yₜ₋₁<sup>orbiter</sup> − yₜ₋₁<sup>parent</sup>,
                xₜ₋₁<sup>orbiter</sup> − xₜ₋₁<sup>parent</sup>
                )
              </td>
              <td>Relative to parent’s previous frame</td>
            </tr>
            <tr>
              <td>Advanced angle</td>
              <td>θₜ₊₁</td>
              <td>θₜ₊₁ = θₜ + ωΔt</td>
              <td>Δt = 1 per step</td>
            </tr>
            <tr>
              <td>New position</td>
              <td>(xₜ₊₁, yₜ₊₁)</td>
              <td>
                (xₜ<sup>parent</sup> + r cos θₜ₊₁,
                yₜ<sup>parent</sup> + r sin θₜ₊₁)
              </td>
              <td>About parent’s current position</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="howit-divider"></div>
    </div>

    <div class="howit-wrap">
      <h2 class="howit-heading">Visual Scenarios</h2>

      <div class="howit-card">
        <h3 class="howit-subheading">Orbital Test Scenario</h3>
        <p class="howit-text">
          This simulation uses fixed μ values and circular orbits to visualize how bodies move over time.
          It helps validate that our numeric update rules produce stable, interpretable trajectories.
        </p>
        <Simulation
          :setup="TestDataScenario"
          :elemWidth="'100vw'"
          :simSec="3500"
        />
      </div>

      <div class="howit-card">
        <h3 class="howit-subheading">Simple Line Scenario</h3>
        <p class="howit-text">
          A 1D chain of satellites along a line. This scenario isolates propagation delay,
          per-hop latency, and packet behavior without orbital geometry, then extends to
          more complex configurations.
        </p>
        <Simulation :setup="SimpleLineScenario" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Container respects global dark theme, no overrides to body/html/root */
.howit-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  background: transparent; /* p-tabpanel / global bg remains in control */
  color: var(--text-main);
}

.howit-wrap {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

/* Typography – namespaced so it doesn't fight global h1/h2 rules */
.howit-title {
  margin: 0 0 1rem;
  font-size: 1.9rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--accent-soft);
}

.howit-heading {
  margin: 1.4rem 0 0.6rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--accent);
}

.howit-subheading {
  margin: 0 0 0.4rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--accent-soft);
}

.howit-text,
.howit-list,
.howit-card p {
  margin: 0.25rem 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-muted);
}

/* Layout + cards */
.howit-grid {
  display: grid;
  gap: 1rem;
}

.howit-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (max-width: 800px) {
  .howit-cols-2 {
    grid-template-columns: 1fr;
  }
}

.howit-card {
  background: rgba(0, 0, 0, 0.9);
  border-radius: var(--radius-lg);
  padding: 1rem 1.2rem;
  box-shadow: var(--shadow-soft);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* Tables – scoped, subtle, matches dark theme */
.howit-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.howit-table thead th {
  background: rgba(255, 255, 255, 0.02);
  color: var(--accent-soft);
  font-weight: 500;
}

.howit-table th,
.howit-table td {
  padding: 0.45rem 0.55rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  text-align: left;
  vertical-align: top;
}

.howit-table tr:last-child th,
.howit-table tr:last-child td {
  border-bottom: none;
}

/* Divider */
.howit-divider {
  margin: 1.8rem 0 0.4rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
