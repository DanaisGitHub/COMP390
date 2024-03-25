export const random = (length: number): string => {
	let result = "";
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

// how to make a new date in js new Date('Year-Month-Day'')
// or Date(Year, Month, Day, Hours, Minutes, Seconds, Milliseconds) as ints

export class DateFunc {
	public static jSDateToSQLDate = (date: Date): string => {
		// create a new Date object
		const mysqlDate = date.toISOString().slice(0, 19).replace('T', ' '); // convert to MySQL date format
		console.log(mysqlDate);
		return mysqlDate; // logs a date string in MySQL format, e.g. "2022-04-01 12:30:00"
	};

	public static sQLDateToJSDate = (date: string): Date => {
		// create a new Date object
		const jsDate = new Date(date); // convert to MySQL date format
		console.log(jsDate);
		return jsDate; // logs a date string in MySQL format, e.g. "2022-04-01 12:30:00"
	};

	public static getTodaysDate = (): Date => {
		const today: Date = new Date();
		const dateAsString: string = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 1);
		const todayDate: Date = new Date(dateAsString);
		return todayDate;
	}

	public static getYearOfDate = (date: Date): number => {
		return date.getFullYear();
	}

	public static stringToDate = (date: string): Date => {
		return new Date(date);
	}

}


export class UserLocations { // REALLY needs improvement, draws a square around liverpool 

	private static minLat = 53.340;
	private static maxLat = 53.477;
	private static minLon = -2.977;
	private static maxLon = -2.822;

	public generateRandomCoordinate(
		minLat = UserLocations.minLat,
		maxLat = UserLocations.maxLat,
		minLon = UserLocations.minLon,
		maxLon = UserLocations.maxLon): [number, number] { // lat and lon are in the format '53.477', '-2.822
		const latitude = Math.random() * (maxLat - minLat) + minLat;
		const longitude = Math.random() * (maxLon - minLon) + minLon;
		return [latitude, longitude];
	}

	public generateRandomCoordinates = (
		minLat = UserLocations.minLat,
		maxLat = UserLocations.maxLat,
		minLon = UserLocations.minLon,
		maxLon = UserLocations.maxLon,
		amount: number): [number, number][] => {
		let coordinates: [number, number][] = [];
		for (let i = 0; i < amount; i++) {
			coordinates.push(this.generateRandomCoordinate(minLat, maxLat, minLon, maxLon));
		}
		return coordinates;
	}



}



