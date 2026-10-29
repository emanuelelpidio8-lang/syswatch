import os
import signal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import psutil

from system import get_system_info, get_top_processes

app = FastAPI(title="Mini Monitor API")

# Permite que o frontend (aberto direto no navegador) fale com a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/system")
def read_system():
    """Dados gerais do sistema em JSON."""
    return get_system_info()


@app.get("/api/processes")
def read_processes():
    """Top processos por uso de memória."""
    return get_top_processes()


@app.post("/api/processes/{pid}/kill")
def kill_process(pid: int):
    """Envia SIGTERM para o processo (o 'kill' educado dos labs)."""
    try:
        proc = psutil.Process(pid)
        proc.terminate()
        return {"status": "terminated", "pid": pid, "name": proc.name()}
    except psutil.NoSuchProcess:
        raise HTTPException(status_code=404, detail="Processo não existe mais")
    except psutil.AccessDenied:
        raise HTTPException(status_code=403, detail="Sem permissão para este processo")


# Serve os arquivos do frontend com caminho absoluto (não quebra independente da pasta)
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend")
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")