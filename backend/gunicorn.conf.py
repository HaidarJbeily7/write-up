# Gunicorn configuration file
import multiprocessing

# Worker configuration
workers = multiprocessing.cpu_count() - 1
worker_class = "uvicorn.workers.UvicornWorker"

# Server socket
bind = "0.0.0.0:8000"

# Logging
loglevel = "info"
accesslog = "-"
errorlog = "-"

# Restart workers after this many requests
max_requests = 1000
max_requests_jitter = 50

# Timeout configuration
timeout = 120
keepalive = 5
