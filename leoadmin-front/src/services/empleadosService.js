const API_URL = "http://localhost:8080/usuarios";

export async function getEmpleados() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Error al obtener empleados");
    }

    return await response.json();
}

export async function createEmpleado(payload) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const text = await response.text();

    if (!response.ok) {
        throw new Error(text || "Error al crear empleado");
    }

    return text;
}

export async function updateEmpleado(id, payload) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const text = await response.text();

    if (!response.ok) {
        throw new Error(text || "Error al actualizar empleado");
    }

    return text;
}

export async function changeEmpleadoStatus(id, activo) {
    const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ activo }),
    });

    const text = await response.text();

    if (!response.ok) {
        throw new Error(text || "Error al cambiar estatus");
    }

    return text;
}