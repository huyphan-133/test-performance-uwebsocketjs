/* Simplified stock exchange made with uWebSockets.js pub/sub */
const { createApp, getConnection, setTransactionsNumber, getTransactionsNumber } = require('./uws/app_factory');
const publisherFactory = require('./redis/publisher_factory');
const subscriberFactory = require('./redis/subscriber_factory');
const stockSubscriberFactory  = require('./amqp/stock_subscriber_factory');
const { initialProtoRoot } = require('./amqp/protobuf_parser');

(async()=>{
	await initialProtoRoot();

	let shares = {
		'NFLX': 280.48,
		'TSLA': 244.74,
		'AMZN': 1720.26,
		'GOOG': 1208.67,
		'NVDA': 183.03
	};
	
	// VDT,A32,AAS,ABB,ABC,ABI,ABW,ACE,ACM,ACS,ACV,ADP,AFX,AG1,AGE,AGF,AGP,AGX,AIC,ALV,AMP,ATA,ATB,ATG,AVC,AVF,B82,BAL,BBH,BBM,BBT,BCA,BCB,BCP,BCV,BDG,BDT,BDW,BEL,BGW,BHA,BHC,BHG,BHK,BHP,BIG,BII,BIO,BKH,BLI,BLN,C21,C22,C4G,C92,CAB,CAD,CAR,CAT,CBI,CBS,CC1,CC4,CCA,CCM,CCP,CCT,CCV,CDG,CDH,CDO,CDP,CDR,CE1,CEG,CEN,CFM,CFV,CGV,CH5,CHC,CHS,CI5,CID,CIP,CK8,CKA,CKD,CLG,CLX,CMD,CMF,CMI,CMK,CMM,CMN,CMP,CMT,CMW,CNA,CNC,CNN,CNT,CPA,CPH,CPI *,CQN,CQT,CSI,CST,CT3,CT6,CTA,CTN,CTW,CVP,CYC,DAC,DAN,DAS,DBM *,DC1,DCF,DCG,DCH,DCR,DCS,DCT,DDH,DDM,DDN,DDV,DFC,DFF,DGT,DHB,DHD,DHN,DIC,DID,DKC,DLD,DLM,DLR,DLT,DM7,DMN,DNA,DND,DNE,DNH,DNL,DNN,DNT,DNW,DOC,DOP,DP1,DP2,DPH,DPP,DPS,DRG,DRI,DSC,DSD,DSG,DSP,VAB,VAV,VBB,VBG,VBH,VC5,VCE,VCP,VCR,VCT,VCW,VCX,VDB,VDN,VE9,VEA,VEC,VEF,VES,VET,VFC,VFR,VFS,VGG,VGI,VGL,VGR,VGT,VGV,VHD,VHF,VHG,VHH,VIE,VIH,VIM,VIN,VIR,VIW,VKC,VKP,VLB,VLC,VLF,VLG,VLP,VLW,VMA,VMG,VMT,VNA,VNB,VNH,VNI,VNP,VNX,VNY,VNZ,VOC,VPA,VPC,VPR,VPW,VQC,VRG,VSE,VSF,VSG,VSN,VST,VTA,VTD,VTE,VTG,VTI,VTK,VTL,VTM,VTP,VTQ,VTR,VTS,VTX,VUA,VVN,VVS,VW3,VWS,VXB,VXP,VXT,WSB,WTC,X26,X77,XDC,XDH,XHC,XLV,XMC,XMD,XMP,XPH,YBC,YTC
	
	const redis_info = {
		socket: {
			host: 'localhost',
			port: 6379
		}
	};
	
	const publisher = publisherFactory.createPublisher(redis_info);
	
	const app = createApp(3000, publisher, shares)
	
	const subscriber = subscriberFactory.createSubscriber(redis_info, app)
	
	stockSubscriberFactory.createStockSubscriber('adapter_ex.datafeed')
	
	// createStockSubscriber('adapter_ex.datafeed')
	
	/* Print transactions per second */
	// let last = Date.now();
	// setInterval(() => {
	// 	time = ((Date.now() - last) * 0.001)
	// 	transactionsPerSecond = getTransactionsNumber() / time
	
	// 	console.log('connection: ' + getConnection())
	// 	console.log("Transactions per second: " + transactionsPerSecond + ", time: " + time + ",here are the curret shares:");
	// 	console.log(shares);
	// 	console.log("");
	// 	setTransactionsNumber(0);
	// 	last = Date.now();
	// }, 1000);
})()

