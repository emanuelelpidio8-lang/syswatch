const API = "http://localhost:8000/api";
const HISTORY_SIZE = 30;

let cpuChart, memChart, diskChart;
const cpuHistory = [];
const memHistory = [];
const diskHistory = [];
const labels = [];

// Cores dos gráficos
const COLORS = {
    cpu: { line: "#00d4ff", fill: "rgba(0, 212, 255, 0.1)" },
    mem: { line: "#7c3aed", fill: "rgba(124, 58, 237, 0.1)" },
    disk: { line: "#2dd4bf", fill: "rgba(45, 212, 191, 0.1)" },
};

function initCharts() {
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { display: false },
            y: { display: false, min: 0, max: 100 },
        },
        animation: { duration: 500 },
    };

    const makeChart = (id, color) => {
        const ctx = document.getElementById(id).getContext("2d");
        return new Chart(ctx, {
            type: "line",
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    borderColor: color.line,
                    backgroundColor: color.fill,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                }],
            },
            options: commonOptions,
        });
    };

    cpuChart = makeChart("cpu-chart", COLORS.cpu);
    memChart = makeChart("mem-chart", COLORS.mem);
    diskChart = makeChart("disk-chart", COLORS.disk);
}

function setCard(id, value, percent) {
    const el = document.getElementById(id);
    el.textContent = value;
    el.classList.remove("ok", "warn", "crit");
    if (percent < 60) el.classList.add("ok");
    else if (percent < 85) el.classList.add("warn");
    else el.classList.add("crit");
}

function pushHistory(arr, chart, value) {
    arr.push(value);
    if (arr.length > HISTORY_SIZE) arr.shift();
    labels.push(new Date().toLocaleTimeString());
    if (labels.length > HISTORY_SIZE) labels.shift();
    chart.data.labels = [...labels];
    chart.data.datasets[0].data = [...arr];
    chart.update("none");
}

async function fetchSystem() {
    const res = await fetch(`${API}/system`);
    if (!res.ok) throw new Error("Falha na API");
    return res.json();
}

async function fetchProcesses() {
    const res = await fetch(`${API}/processes`);
    if (!res.ok) throw new Error("Falha na API");
    return res.json();
}

function renderProcesses(processes) {
    const tbody = document.getElementById("process-table-body");
    document.getElementById("process-count-badge").textContent = processes.length;

    if (!processes.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="loading">Nenhum processo</td></tr>';
        return;
    }

    tbody.innerHTML = processes.map(p => `
        <tr>
            <td>${p.pid}</td>
            <td>${escapeHtml(p.name)}</td>
            <td>${p.cpu_percent.toFixed(1)}</td>
            <td>${p.memory_percent.toFixed(1)}</td>
            <td>
                <button class="kill-btn" onclick="killProcess(${p.pid})">KILL</button>
            </td>
        </tr>
    `).join("");
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

async function killProcess(pid) {
    if (!confirm(`Matar processo ${pid}?`)) return;
    try {
        const res = await fetch(`${API}/processes/${pid}/kill`, { method: "POST" });
        const data = await res.json();
        if (res.ok) {
            alert(`Processo ${data.name} (${pid}) terminado.`);
            refresh();
        } else {
            alert(data.detail || "Erro ao matar processo");
        }
    } catch (err) {
        alert("Erro de conexão: " + err.message);
    }
}

function setStatus(state, text) {
    const pill = document.getElementById("connection-status");
    pill.className = "status-pill " + state;
    pill.innerHTML = `<span class="pulse"></span> ${text}`;
}

async function refresh() {
    try {
        const [sys, procs] = await Promise.all([fetchSystem(), fetchProcesses()]);

        setCard("cpu-value", sys.cpu_percent.toFixed(1) + "%", sys.cpu_percent);
        setCard("mem-value", sys.memory.percent.toFixed(1) + "%", sys.memory.percent);
        setCard("disk-value", sys.disk.percent.toFixed(1) + "%", sys.disk.percent);
        document.getElementById("proc-value").textContent = sys.process_count;

        pushHistory(cpuHistory, cpuChart, sys.cpu_percent);
        pushHistory(memHistory, memChart, sys.memory.percent);
        pushHistory(diskHistory, diskChart, sys.disk.percent);

        renderProcesses(procs);
        setStatus("online", "online · atualizado " + new Date().toLocaleTimeString());
    } catch (err) {
        setStatus("offline", "offline");
    }
}

initCharts();
refresh();
setInterval(refresh, 2000);