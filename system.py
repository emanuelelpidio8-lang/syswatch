import psutil


def get_system_info():
    """Coleta os dados essenciais do sistema e devolve como dicionário."""
    return {
        "cpu_percent": psutil.cpu_percent(interval=1),
        "memory": {
            "total_gb": round(psutil.virtual_memory().total / (1024**3), 2),
            "available_gb": round(psutil.virtual_memory().available / (1024**3), 2),
            "percent": psutil.virtual_memory().percent,
        },
        "disk": {
            "total_gb": round(psutil.disk_usage("/").total / (1024**3), 2),
            "used_gb": round(psutil.disk_usage("/").used / (1024**3), 2),
            "percent": psutil.disk_usage("/").percent,
        },
        "process_count": len(psutil.pids()),
    }


def get_top_processes(limit=15):
    """Retorna os processos que mais consomem memória."""
    processes = []
    for proc in psutil.process_iter(["pid", "name", "memory_percent", "cpu_percent"]):
        try:
            info = proc.info
            processes.append({
                "pid": info["pid"],
                "name": info["name"] or "desconhecido",
                "memory_percent": info["memory_percent"] or 0.0,
                "cpu_percent": info["cpu_percent"] or 0.0,
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue
    processes.sort(key=lambda p: p["memory_percent"], reverse=True)
    return processes[:limit]