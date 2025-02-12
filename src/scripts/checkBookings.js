import PocketBase from 'pocketbase';

const pb = new PocketBase("http://localhost:8090");

async function checkBookingsForCheckout() {
	try {
		const nowISO = new Date().toISOString();
		const bookingsData = await pb.collection("bookings").getFullList( {
			filter: `check_out <= "${nowISO}" && is_canceled = false`
		});

		for (const booking of bookingsData.items) {
			if (Array.isArray(booking.room)) {
				for (const roomId of booking.room) {
					await pb.collection("rooms").update(roomId, { available: true });
				}
			}
			await pb.collection("bookings").update(booking.id, { is_canceled: true });
		}

		console.log(`Checked and updated expired bookings at ${new Date().toLocaleTimeString()}`);
	} catch (error) {
		console.error("Error during booking cancellation:", error);
	}
}

// Run every minute
setInterval(checkBookingsForCheckout, 3600000);
