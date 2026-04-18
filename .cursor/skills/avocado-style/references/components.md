# AVCD Tech — Component Reference

Full copy-paste implementations for every component in the design system.
Always import fonts and declare CSS variables before using any component.

---

## Boilerplate (include at top of every file)

```html
<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Roboto+Condensed:wght@400;700&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet" />

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --green:     #1B4332;
  --green-mid: #2D6A4F;
  --green-lt:  #52B788;
  --beige:     #F5F0E8;
  --beige-2:   #EDE8DF;
  --beige-3:   #E0D9CE;
  --text:      #1B4332;
  --text-2:    #4A6741;
  --text-3:    #7A8C75;
  --border:    #C8C0B0;
  --serif:     'Libre Baskerville', Georgia, serif;
  --cond:      'Roboto Condensed', sans-serif;
  --mono:      'Roboto Mono', monospace;
}

body {
  background: var(--beige);
  font-family: var(--cond);
  color: var(--text);
}
</style>
```

---

## Section Bar

```html
<style>
.section-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 2px solid var(--green);
  padding-bottom: 6px;
  margin-bottom: 20px;
}
.section-tag {
  font-family: var(--cond);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--beige);
  background: var(--green);
  padding: 2px 8px;
}
.section-title {
  font-family: var(--cond);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--green);
}
.section-count {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-3);
  margin-left: auto;
}
</style>

<div class="section-bar">
  <span class="section-tag">Live</span>
  <span class="section-title">Employee Directory</span>
  <span class="section-count">4 records</span>
</div>
```

---

## Employee Card (full)

```html
<style>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  border-top: 1px solid var(--border);
  border-left: 1px solid var(--border);
}
.card {
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 14px 14px 12px;
  cursor: pointer;
  background: var(--beige);
  transition: background 0.12s;
}
.card:hover { background: var(--beige-2); }
.card-eyebrow {
  font-family: var(--cond);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--green-lt);
  margin-bottom: 8px;
}
.card-name {
  font-family: var(--serif);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.15;
  color: var(--green);
  margin-bottom: 3px;
}
.card-role {
  font-family: var(--cond);
  font-size: 11px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-3);
  margin-bottom: 14px;
}
.card-rule { height: 1px; background: var(--border); margin-bottom: 12px; }
.card-rows { display: flex; flex-direction: column; gap: 7px; margin-bottom: 14px; }
.card-row { display: flex; justify-content: space-between; align-items: baseline; }
.card-label {
  font-family: var(--cond);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-3);
}
.card-value {
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 500;
  color: var(--text);
}
.card-value.hi { color: var(--green-mid); }
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid var(--border);
}
.status-dot {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--cond);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-3);
}
.dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border); }
.dot.active { background: var(--green-lt); }
.status-dot.active { color: var(--green-mid); }
.card-dept {
  font-family: var(--cond);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-3);
}
</style>

<div class="grid">
  <div class="card">
    <div class="card-eyebrow">E-001</div>
    <div class="card-name">Sofia Reyes</div>
    <div class="card-role">Frontend Engineer</div>
    <div class="card-rule"></div>
    <div class="card-rows">
      <div class="card-row">
        <span class="card-label">Dept</span>
        <span class="card-value">Engineering</span>
      </div>
      <div class="card-row">
        <span class="card-label">Location</span>
        <span class="card-value">Miami, FL</span>
      </div>
      <div class="card-row">
        <span class="card-label">Salary</span>
        <span class="card-value hi">$118,000</span>
      </div>
    </div>
    <div class="card-footer">
      <span class="status-dot active"><span class="dot active"></span>active</span>
      <span class="card-dept">Engineering</span>
    </div>
  </div>
</div>
```

---

## Detail Panel / Modal

```html
<style>
.overlay {
  display: none;
  position: fixed; inset: 0;
  background: rgba(27,67,50,0.45);
  z-index: 30;
  align-items: center;
  justify-content: center;
}
.overlay.open { display: flex; }
.panel {
  background: var(--beige);
  border: 1px solid var(--border);
  border-top: 3px solid var(--green);
  width: 400px;
  max-width: 94vw;
}
.panel-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--beige-2);
}
.panel-label {
  font-family: var(--cond);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-3);
}
.panel-close {
  font-family: var(--cond);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--green);
}
.panel-close:hover { text-decoration: underline; }
.panel-body { padding: 20px 16px 16px; }
.panel-eyebrow {
  font-family: var(--cond);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--green-lt);
  margin-bottom: 6px;
}
.panel-name {
  font-family: var(--serif);
  font-size: 28px;
  font-weight: 700;
  line-height: 1.1;
  color: var(--green);
  margin-bottom: 4px;
}
.panel-role {
  font-family: var(--cond);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--text-3);
  margin-bottom: 18px;
}
.panel-rule { height: 2px; background: var(--green); margin-bottom: 14px; }
.panel-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
}
.panel-row:last-child { border-bottom: none; }
.panel-row-label {
  font-family: var(--cond);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-3);
}
.panel-row-value {
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 500;
  color: var(--text);
}
.panel-row-value.accent { color: var(--green-mid); }
</style>

<div class="overlay" id="overlay">
  <div class="panel">
    <div class="panel-topbar">
      <span class="panel-label">Employee Record</span>
      <button class="panel-close" onclick="document.getElementById('overlay').classList.remove('open')">Close ✕</button>
    </div>
    <div class="panel-body">
      <div class="panel-eyebrow">E-001 · Engineering</div>
      <div class="panel-name">Sofia Reyes</div>
      <div class="panel-role">Frontend Engineer · Miami, FL</div>
      <div class="panel-rule"></div>
      <div class="panel-row">
        <span class="panel-row-label">Email</span>
        <span class="panel-row-value">s.reyes@avcd.tech</span>
      </div>
      <div class="panel-row">
        <span class="panel-row-label">Salary</span>
        <span class="panel-row-value accent">$118,000</span>
      </div>
      <div class="panel-row">
        <span class="panel-row-label">Start Date</span>
        <span class="panel-row-value">Mar 2023</span>
      </div>
      <div class="panel-row">
        <span class="panel-row-label">Status</span>
        <span class="panel-row-value accent">ACTIVE</span>
      </div>
    </div>
  </div>
</div>
```

---

## Data Table

For list/tabular views instead of cards.

```html
<style>
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--cond);
}
.data-table thead tr {
  border-bottom: 2px solid var(--green);
}
.data-table th {
  font-family: var(--cond);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-3);
  padding: 6px 12px 6px 0;
  text-align: left;
}
.data-table tbody tr {
  border-bottom: 1px solid var(--border);
  transition: background 0.1s;
}
.data-table tbody tr:hover { background: var(--beige-2); }
.data-table td {
  padding: 10px 12px 10px 0;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text);
}
.data-table td.name-cell {
  font-family: var(--serif);
  font-size: 14px;
  font-weight: 700;
  color: var(--green);
}
.data-table td.muted {
  color: var(--text-3);
  font-family: var(--cond);
  font-size: 11px;
}
.data-table td.accent { color: var(--green-mid); }
</style>

<table class="data-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Role</th>
      <th>Location</th>
      <th>Salary</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="muted">E-001</td>
      <td class="name-cell">Sofia Reyes</td>
      <td class="muted">Frontend Engineer</td>
      <td>Miami, FL</td>
      <td class="accent">$118,000</td>
      <td class="muted">Active</td>
    </tr>
  </tbody>
</table>
```

---

## Stat / Metric Card

For summary numbers at the top of dashboards.

```html
<style>
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0;
  border-top: 1px solid var(--border);
  border-left: 1px solid var(--border);
  margin-bottom: 24px;
}
.stat-card {
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 14px;
}
.stat-label {
  font-family: var(--cond);
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-3);
  margin-bottom: 6px;
}
.stat-value {
  font-family: var(--serif);
  font-size: 28px;
  font-weight: 700;
  color: var(--green);
  line-height: 1;
}
.stat-value.accent { color: var(--green-mid); }
.stat-sub {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-3);
  margin-top: 4px;
}
</style>

<div class="stat-grid">
  <div class="stat-card">
    <div class="stat-label">Total Employees</div>
    <div class="stat-value">142</div>
    <div class="stat-sub">+3 this month</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Avg. Salary</div>
    <div class="stat-value accent">$112k</div>
    <div class="stat-sub">across all depts</div>
  </div>
</div>
```

---

## Form Input

```html
<style>
.form-group { margin-bottom: 16px; }
.form-label {
  display: block;
  font-family: var(--cond);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-3);
  margin-bottom: 6px;
}
.form-input {
  width: 100%;
  font-family: var(--mono);
  font-size: 13px;
  color: var(--text);
  background: var(--beige);
  border: 1px solid var(--border);
  padding: 8px 10px;
  outline: none;
  transition: border-color 0.15s;
}
.form-input:focus { border-color: var(--green); }
.form-input::placeholder { color: var(--text-3); }
</style>

<div class="form-group">
  <label class="form-label">Full Name</label>
  <input class="form-input" type="text" placeholder="Sofia Reyes" />
</div>
```

---

## Tag / Badge

```html
<style>
.tag {
  display: inline-block;
  font-family: var(--cond);
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 2px 8px;
}
.tag-green  { background: var(--green);    color: var(--beige); }
.tag-outline { background: transparent; border: 1px solid var(--border); color: var(--text-3); }
.tag-accent  { background: var(--beige-2); color: var(--green-mid); border: 1px solid var(--green-lt); }
</style>

<span class="tag tag-green">Active</span>
<span class="tag tag-outline">Inactive</span>
<span class="tag tag-accent">Engineering</span>
```
