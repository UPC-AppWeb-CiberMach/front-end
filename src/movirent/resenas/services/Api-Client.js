export default {
    getScooters() {
        return fetch('http://localhost:3000/scooter')
            .then(response => response.json())
            .catch(error => {
                console.error("Error fetching scooters:", error);
                throw error;
            });
    },

    getScooterById(id) {
        return fetch(`http://localhost:3000/scooter/${id}`)
            .then(response => response.json())
            .catch(error => {
                console.error("Error fetching scooter details:", error);
                throw error;
            });
    },

    postReview(scooterId, review) {
        return fetch(`http://localhost:3000/scooter/${scooterId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(review)
        })
            .then(response => response.json())
            .catch(error => {
                console.error("Error posting review:", error);
                throw error;
            });
    }
};
