/* NOTE: ws as client cannot even remotely stress uWebSockets.js,
 * however we don't care for ultra correctness here as
 * Socket.IO is so pointlessly slow anyways, we simply do not care */
const WebSocket = require('ws');

/* By default we use 10% active traders, 90% passive watchers */
const numClients = process.env.NUM_CLIENT || 1000;
const sharePerClients = process.env.SHARES_PER_CLIENT || 30;

const shares = ['AAA', 'AAM', 'AAT', 'ABR', 'ABS', 'ABT', 'ACB', 'ACC', 'ACG', 'ACL', 'ADG', 'ADS', 'AGG', 'AGM', 'AGR', 'AMD', 'ANV', 'APC', 'APG', 'APH', 'ASG', 'ASM', 'ASP', 'AST', 'BAF', 'BBC', 'BCE', 'BCG', 'BCM', 'BFC', 'BHN', 'BIC', 'BID', 'BKG', 'BMC', 'BMI', 'BMP', 'BRC', 'BSI', 'BTP', 'BTT', 'BVH', 'BWE', 'C32', 'C47', 'CAV', 'CCI', 'CCL', 'CDC', 'CHP', 'CIG', 'CII', 'CKG', 'CLC', 'CLL', 'CLW', 'CMG', 'CMV', 'CMX', 'CNG', 'COM', 'CRC', 'CRE', 'CSM', 'CSV', 'CTD', 'CTF', 'CTG', 'CTI', 'CTR', 'CTS', 'CVT', 'D2D', 'DAG', 'DAH', 'DAT', 'DBC', 'DBD', 'DBT', 'DC4', 'DCL', 'DCM', 'DGC', 'DGW', 'DHA', 'DHC', 'DHG', 'DHM', 'DIG', 'DLG', 'DMC', 'DPG', 'DPM', 'DPR', 'DQC', 'DRC', 'DRH', 'DRL', 'DSN', 'DTA', 'DTL', 'DTT', 'DVP', 'DXG', 'DXS', 'DXV', 'E1VFVN30', 'EIB', 'ELC', 'EMC', 'EVE', 'EVF', 'EVG', 'FCM', 'FCN', 'FDC', 'FIR', 'FIT', 'FMC', 'FPT', 'FRT', 'FTS', 'FUCTVGF3', 'FUCTVGF4', 'FUCVREIT', 'FUEDCMID', 'FUEFCV50', 'FUEIP100', 'FUEKIV30', 'FUEKIVFS', 'FUEMAV30', 'FUEMAVND', 'FUESSV30', 'FUESSV50', 'FUESSVFL', 'FUEVFVND', 'FUEVN100', 'GAB', 'GAS', 'GDT', 'GEG', 'GEX', 'GIL', 'GMC', 'GMD', 'GMH', 'GSP', 'GTA', 'GVR', 'HAG', 'HAH', 'HAP', 'HAR', 'HAS', 'HAX', 'HBC', 'HCD', 'HCM', 'HDB', 'HDC', 'HDG', 'HHP', 'HHS', 'HHV', 'HID', 'HII', 'HMC', 'HNG', 'HPG', 'HPX', 'HQC', 'HRC', 'HSG', 'HSL', 'HT1', 'HTI', 'HTL', 'HTN', 'HTV', 'HU1', 'HUB', 'HVH', 'HVN', 'HVX', 'IBC', 'ICT', 'IDI', 'IJC', 'ILB', 'IMP', 'ITA', 'ITC', 'ITD', 'JVC', 'KBC', 'KDC', 'KDH', 'KHG', 'KHP', 'KMR', 'KOS', 'KPF', 'KSB', 'L10', 'LAF', 'LBM', 'LCG', 'LDG', 'LEC', 'LGC', 'LGL', 'LHG', 'LIX', 'LM8', 'LPB', 'LSS', 'MBB', 'MCP', 'MDG', 'MHC', 'MIG', 'MSB', 'MSH', 'MSN', 'MWG', 'NAF', 'NAV', 'NBB', 'NCT', 'NHA', 'NHH', 'NHT', 'NKG', 'NLG', 'NNC', 'NO1', 'NSC', 'NT2', 'NTL', 'NVL', 'NVT', 'OCB', 'OGC', 'OPC', 'ORS', 'PAC', 'PAN', 'PC1', 'PDN', 'PDR', 'PET', 'PGC', 'PGD', 'PGI', 'PGV', 'PHC', 'PHR', 'PIT', 'PJT', 'PLP', 'PLX', 'PMG', 'PNC', 'PNJ', 'POM', 'POW', 'PPC', 'PSH', 'PTB', 'PTC', 'PTL', 'PVD', 'PVP', 'PVT', 'QBS', 'QCG', 'RAL', 'RDP', 'REE', 'S4A', 'SAB', 'SAM', 'SAV', 'SBA', 'SBT', 'SBV', 'SC5', 'SCD', 'SCR', 'SCS', 'SFC', 'SFG', 'SFI', 'SGN', 'SGR', 'SGT', 'SHA', 'SHB', 'SHI', 'SHP', 'SJD', 'SJF', 'SJS', 'SKG', 'SMA', 'SMB', 'SMC', 'SPM', 'SRC', 'SRF', 'SSB', 'SSC', 'SSI', 'ST8', 'STB', 'STG', 'STK', 'SVC', 'SVD', 'SVI', 'SVT', 'SZC', 'SZL', 'TBC', 'TCB', 'TCD', 'TCH', 'TCL', 'TCM', 'TCO', 'TCR', 'TCT', 'TDC', 'TDG', 'TDH', 'TDM', 'TDP', 'TDW', 'TEG', 'TGG', 'THG', 'THI', 'TIP', 'TIX', 'TLD', 'TLG', 'TLH', 'TMP', 'TMS', 'TMT', 'TN1', 'TNA', 'TNC', 'TNH', 'TNI', 'TNT', 'TPB', 'TPC', 'TRA', 'TRC', 'TSC', 'TTA', 'TTB', 'TTE', 'TTF', 'TV2', 'TVB', 'TVS', 'TVT', 'TYA', 'UIC', 'VAF', 'VCA', 'VCB', 'VCF', 'VCG', 'VCI', 'VDP', 'VDS', 'VFG', 'VGC', 'VHC', 'VHM', 'VIB', 'VIC', 'VID', 'VIP', 'VIX', 'VJC', 'VMD', 'VND', 'VNE', 'VNG', 'VNL', 'VNM', 'VNS', 'VOS', 'VPB', 'VPD', 'VPG', 'VPH', 'VPI', 'VPS', 'VRC', 'VRE', 'VSC', 'VSH', 'VSI', 'VTB', 'VTO', 'YBM', "YEG"];

function getRandomElements(arr, randomNumber) {
	let maximumStartNumber = arr.length - randomNumber

	//gen randomStartNumber that is less than maximumStartNumber
	let randomStartNumber = parseInt(Math.random() * maximumStartNumber)
	return arr.slice(randomStartNumber, randomStartNumber + randomNumber)
}

function establishConnections(remainingClients) {
	``
	let isLast = false;
	if (!remainingClients) {
		return;
	}

	let host = process.env.HOST || 'localhost'
	let socket = new WebSocket(`ws://${host}:3000`);
	socket.onopen = () => {
		/* Randomly select one share this client will be interested in */
		let shareOfInterests = getRandomElements(shares, sharePerClients)

		/* Subscribe to the shares we are interested in */
		shareOfInterests.forEach(shareOfInterest => {
			// console.log(`subscribe shareOfInterest: ${shareOfInterest}`);
			socket.send(JSON.stringify({ action: 'sub', share: shareOfInterest }))
		});

		isLast = remainingClients == 1;
		establishConnections(remainingClients - 1);
	};

	socket.onmessage = (e) => {
		let json = JSON.parse(e.data);

		/* Keep track of our one share value (even though current strategy doesn't care for value) */
		for (let share in json) {
			value = json[share];
			console.log(value.symbol)
		}
	};

	socket.onclose = () => {
		console.log("We did not expect any client to disconnect, exiting!");
		process.exit();
	}
}

establishConnections(numClients);