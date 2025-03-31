
async function deleteService(serviceId) {
    if (confirm("are you sure you want to delete service" + serviceId)) {
        url = "/admin/service/delete/" + serviceId
        try {
            const response = await fetch(url)
            if (!response.ok) {
                alert("failed to delete service with id: " + serviceId)
            }
            else {
                const json_response = await response.json()
                if (!json_response) {
                    alert("could not delete service fetch data for " + serviceId, error)
                    return false
                }
                if (json_response.actionCompleted) {
                    alert(serviceId + " has been deleted successfully!")
                }
            }
        }
        catch (error) {
            console.log("could not delete service fetch data for " + serviceId, error)
        }
    }
}

async function edit(serviceId, title = false, description = false) {
    url = "/admin/service/update/" + serviceId
    if (title) data.title = title
    if (description) data.description = description

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        if (!response.ok) {
            alert("failed to update service with id: " + serviceId)
        }
        else {
            const json_response = await response.json()
            if (!json_response) {
                alert("could not update service " + serviceId, error)
                return false
            }
            if (json_response.actionCompleted) {
                alert(serviceId + " has been updated successfully!")
            }
        }
    }
    catch (error) {
        console.log("could not update service " + serviceId, error)
    }
}