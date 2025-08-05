import psycopg2

conn = psycopg2.connect(
    dbname="misrutas",
    user="postgres",
    password="NuevaPassword123",
    host="host.docker.internal",
    port="5432",
    options="-c client_encoding=UTF8"
)

print("Conectado con éxito ✅")
conn.close()