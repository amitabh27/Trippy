

var casper = require("casper").create({
			waitTimeout: 10000,
			stepTimeout: 10000,
			//logLevel: 'debug',
			verbose: true,
			pageSettings: {
				webSecurityEnabled: false
			},
			onWaitTimeout: function() {
			this.echo('** Wait-TimeOut **');
			},
			onStepTimeout: function() {
			this.echo('** Step-TimeOut **');
			},
			loadImages:  false
			});

require("utils").dump(casper.cli.args);
require("utils").dump(casper.cli.options);



if(casper.cli.get(0)=="flights")
{

	var names=["New Delhi","Mumbai","Bangalore","Chennai","Kolkata","Cochin","Ahmedabad","Hyderabad","Pune","Dabolim",
									"Trivandrum","Lucknow","Jaipur","Guwahati","Kozikhode","Srinagar","Bhubneshwar","Vishakapatnam","Coimbatore","Indore",
									"Mangalore","Nagpur","Patna","Chandigarh","Tiruchilapalli","Varanasi","Raipur","Amritsar","Jammu","Bagdogra",
									"Vadodra","Agartala","Port Blair","Madurai","Imphal","Ranchi","Udaipur","Dehradun","Bhopal","Leh",
									"Rajkot","Vijaywada","Tirupati","Dibrugarh","Jodhpur","Aurangabad","Rajahmundry","Silchar","Jabalpur","Aizwal"
									];

						var codes=[
									"DEL","BOM","BLR","MAA","CCU","COK","AMD","HYD","PNQ","GOI",
									"TRV","LKO","JAI","GAU","CCJ","SXR","BBI","VTZ","CJB","IDR",
									"IXE","NAG","PAT","IXC","TRZ","VNS","RPR","ATQ","IXJ","IXB",
									"BDQ","IXA","IXZ","IXM","IMF","IXR","UDR","DED","BHO","IXL",
									"RAJ","VJA","TIR","DIB","JDH","IXU","RJA","IXS","JLR","AJL"
									];
									
	//take the source,destination,date
	var source=casper.cli.get(1);
	var destination=casper.cli.get(2);
	var date=casper.cli.get(3);
	var source_code="";
	var destination_code="";
	var indx=-1;
	
	//console.log('source:', source);console.log('d:', destination);console.log('date:', date);
	
								for(var i=0;i<names.length;i++)
								{
									if(names[i]==source)
									{source_code=codes[i];indx=i;}
									else if(names[i]==destination)
									destination_code=codes[i];
									
									if(source_code!="" && destination_code!="")
									break;
									
								}
	
	var baseurl="https://flights.makemytrip.com/makemytrip/search/O/O/E/1/0/0/S/V0/";
	baseurl=baseurl.concat(source_code,"_",destination_code,"_");
	var year=date.substring(date.lastIndexOf("/")+1);
	var month=date.substring(date.indexOf("/")+1,date.lastIndexOf("/"));
	var day=date.substring(0,date.indexOf("/"));
	//console.log('source:', source_code);console.log('d:', destination_code);console.log('date:', year,month,day);

	baseurl=baseurl.concat(day,"-",month,"-",year,"?contains=false&remove=");
	
	console.log('baseurl=',baseurl);
	

		casper.userAgent('Mozilla/5.0 (Windows NT 6.0) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/13.0.782.41 Safari/535.1');
		casper.start(baseurl,function(){
		this.scrollToBottom();
		});
		//casper.thenOpen(baseurl);
		console.log("URL loaded......");

	casper.then(function() {
	//logic here
	this.waitForSelector(".listing_top.clearfix",

		function pass () {
		console.log("Continue");
		this.capture('screener.png'); 
		},
		function fail () {
        this.die("Did not load element... something is wrong");
		this.capture('screener.png'); 
		}
	);



	console.log("just before running......");
	});

	casper.on('remote.message', function(msg) {
	casper.echo(msg);
	});


	//start your script
	casper.run(function(){
	console.log("running......");



		var links = this.evaluate(function(){

		var results = new Array(); 
		var t=0;
		var elts = document.querySelectorAll("div.listing_top.clearfix div.top_first_part.clearfix"); 
		for(var i = 0; i < elts.length; i++){
		var link = elts[i].innerText;
		link = link.replace('...','');
		link = link.replaceAll('Non stop\n','');
		link = link.replaceAll('1 Stop\n','');
		link = link.replaceAll('2 Stop\n','');
		link = link.replaceAll('\n','*');


		var flight_type;
		var number;
		var duration;
		var departure;
		var arrival;
		var fare;
		var prev=-1;
		var c=0;

		for(var j=0;j<link.length;j++)
		{
	
			if(link.charAt(j)=='*')
			{
			if(c==0)
			flight_type=link.substring(prev+1,j);
			else if(c==1)
			number=link.substring(prev+1,j);
			else if(c==2)
			departure=link.substring(prev+1,j);
			else if(c==3)
			duration=link.substring(prev+1,j);
			else if(c==4)
			arrival=link.substring(prev+1,j);
			else if(c==5)
			fare=link.substring(prev+1,j);

			c++;
			prev=j;
			}
		if(c==6)
		{
		//console.log("-------->",flight_type,number,departure,duration,arrival,fare,"\n");
		results[t]=new Array();
			for(var k=0;k<6;k++)
			{
				if(k==0)
				results[t][k]=flight_type;
				if(k==1)
				results[t][k]=number;
				if(k==2)
				results[t][k]=departure;
				if(k==3)
				results[t][k]=duration;
				if(k==4)
				results[t][k]=arrival;
				if(k==5)
				results[t][k]=fare;
			}
		//console.log("***********",results[t][0],results[t][1],results[t][2],results[t][3],results[t][4],results[t][5],"\n");
		t++;
		c=0;
		}
	}
	
}
return results; 
});

var suggestions = this.evaluate(function(){
var temp=document.querySelectorAll("div.jcarousel.date_price")[0].innerText; 
temp = temp.replaceAll('\n','*');
var results = new Array(); 
var date;
var price;
var prev=-1;
var t=0;
var c=0;

	temp=temp.concat("*");
	//console.log("SUGGESTIONS=",temp);
	for(var i=0;i<temp.length;i++)
	{

		if(temp.charAt(i)=='*')
		{
			if(t==0)
			{date=temp.substring(prev+1,i);t=1;}
			else if(t==1)
			{price=temp.substring(prev+1,i);t=2;}
		
		prev=i;
		}
		if(t==2)
		{
		results[c]=new Array();
			for(var j=0;j<2;j++)
			{
			if(j==0)
			results[c][0]=date;
			if(j==1)
			results[c][1]=price;
			}
		c++;
		t=0;
		}
	}

return results;
});

console.log("There were "  + links.length + " flights");
console.log("Suggestions are as follows :","\n");
for(var i = 0; i < suggestions.length; i++){
console.log("--------------------------------------------------------------------------");
console.log(suggestions[i][0],suggestions[i][1]);
}


for(var i = 0; i < links.length; i++){
console.log("--------------------------------------------------------------------------");
console.log("Info=",links[i][0],links[i][1],links[i][2],links[i][3],links[i][4],links[i][5]);
}

 this.die('\n'+'Done');

});
	
	
	
}

if(casper.cli.get(0)=="buses")
{

	var names=["Mumbai","Bangalore","Chennai","Ahmedabad","Aurangabad","Agra","Amritsar","Aligarh","Akola","Amravati","Ajmer","Allahabad","Ananthapur","Bhubaneshwar","Bareilly",
			"Baroda","Bijapur","Bidar","Bhuntar","Calcutta","Chandigarh","Coimbator","Raipur(chhattisgarh)","Calicut","Chidambaram","Chandrapur",
			"Cheruthoni","Delhi","Dehradun","Dharamshala","Dindigu;","Davanagere","Dhule","Durgapur","Digha","Dharwad","Ernakulam","Erode","Eluru","Etawah",
			"Eluru(By-Pass)","Erode Bypass","Ernakulam Bypass","Ettumanoor","ErodeBypass(chithode)","Kolkata"];
			
	var codes=[122,462,123];
									
	//take the source,destination,date
	var source=casper.cli.get(1);
	var destination=casper.cli.get(2);
	var date=casper.cli.get(3);
	
	var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var ind=date.substring(date.indexOf("/")+1,date.lastIndexOf("/"));
	if(ind.charAt(0)=='0')
	ind=ind.substring(1);
	
	ind=ind-1;
	var m=months[ind];
	
	date=date.substring(0,date.indexOf("/")).concat("-").concat(m).concat("-").concat(date.substring(date.lastIndexOf("/")+1));
	
	var source_code="";
	var destination_code="";
	var indx=-1;
	
	//console.log('source:', source);console.log('d:', destination);console.log('date:', date);
	
								for(var i=0;i<names.length;i++)
								{
									if(names[i]==source)
									{source_code=codes[i];indx=i;}
									else if(names[i]==destination)
									destination_code=codes[i];
									
									if(source_code!="" && destination_code!="")
									break;
									
								}
	
	var baseurl="https://www.redbus.in/search?fromCityName=";	
	baseurl=baseurl.concat(source,"&fromCityId=",source_code,"&toCityName=",destination,"&toCityId=",destination_code,"&onward=",date,"&opId=0&busType=Any");
	
	casper.userAgent('Mozilla/5.0 (Windows NT 6.0) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/13.0.782.41 Safari/535.1');
		casper.start(baseurl,function(){
		this.scrollToBottom();
		});
		console.log("URL loaded......");

	casper.then(function() {
	//logic here
	this.waitForSelector("div.clearfix.main-body.bus-tupple",

		function pass () {
		console.log("Continue");
		this.capture('screener.png'); 
		},
		function fail () {
        this.die("Did not load element... something is wrong");
		this.capture('screener.png'); 
		}
	);



	//console.log("just before running......");
	});

	casper.on('remote.message', function(msg) {
	casper.echo(msg);
	});


	//start your script
	casper.run(function(){
	console.log("running......");
	var links = this.evaluate(function(){
		var results = new Array(); 
		var t=0;
		var elts = document.querySelectorAll("div.clearfix.main-body.bus-tupple");
		//console.log("LENGTH OF RECORDS=",elts.length);
		for(var i = 0; i < elts.length; i++){
		var link = elts[i].innerText;
		
		if(link.indexOf("SOLD OUT")!=-1)
		continue;
		if(link.indexOf("RED DEALS Get 5.0 % Extra OFF Know more")!=-1)
		{
		var len="RED DEALS Get 5.0 % Extra OFF Know more";
		var l=len.length;
		link=link.substring(l+2);
		}

		link = link.replace('VIEW SEATS','');link = link.replace('INR','');link = link.replace('Seats','');link = link.replace('Window','');
		link = link.replace('Starts from','');
		
		link = link.replace('\n','*');link = link.replace('\n','*');link = link.replace('\n','*');link = link.replace('\n','*');link = link.replace('\n','*');
		link = link.replace('\n','*');link = link.replace('\n','*');link = link.replace('\n','*');link = link.replace('\n','*');link = link.replace('\n','*');
		link = link.replace('\n','*');
		
		//console.log("RAW:::::::",link);
		var bus_type;
		var desc;
		var g1;
		var g2;
		var times;
		var duration;
		var rating;
		var seats;
		var window;
		var fare;
		
		var prev=-1;
		var c=0;
		

		for(var j=0;j<link.length;j++)
		{
	
			if(link.charAt(j)=='*')
			{
			if(c==0)
			bus_type=link.substring(prev+1,j);
			else if(c==1)
			desc=link.substring(prev+1,j);
			else if(c==2)
			g1=link.substring(prev+1,j); //g
			else if(c==3)
			g2=link.substring(prev+1,j); //g
			else if(c==4)
			times=link.substring(prev+1,j);
			else if(c==5)
			duration=link.substring(prev+1,j);
			else if(c==6)
			rating=link.substring(prev+1,j);
			else if(c==7)
			seats=link.substring(prev+1,j);
			else if(c==8)
			window=link.substring(prev+1,j);
			else if(c==9)
			fare=link.substring(prev+1,j);//g
			else if(c==10)
			fare=link.substring(prev+1,j);
			
			c++;
			prev=j;
			}
		
			
		if((c==10 && link.indexOf("**")==-1) || (c==11 && link.indexOf("**")!=-1) )
		{
		results[t]=new Array();
			results[t][0]=bus_type;
			results[t][1]=desc;
			results[t][2]=times.substring(0,5);
			results[t][3]=times.substring(5);
			results[t][4]=duration;
			results[t][5]=rating;
			results[t][6]=seats;
			results[t][7]=window;
			results[t][8]=fare;
		
		t++;
		c=0;
		}
	}
			
}


return results; 
});	

	for(var i=0;i<links.length;i++)
	{
	console.log("_______________________________________________________________");	
	console.log(links[i][0],"\n",links[i][1],"\n",links[i][2],"\n",links[i][3],"\n",links[i][4],"\n",links[i][5],"\n",links[i][6],"\n",links[i][7],"\n",links[i][8],"\n");
	}	
		
	 this.die('\n'+'Done');
	});
	//run closing
	
}




if(casper.cli.get(0)=="trains")
{
	var names =["Abada", "Abhaipur", "Abhayapuri", "Abohar", "Abu Road", "Abutara Halt", "Acharapakkam", "Acharya Narendra Dev", "Achalganj", "Achalpur", "Achhalda", "AchhneraJunction", "Adarshnagar", "Adarshnagar Delhi", "Adas Road", "Adesar", "Adgaon Buzurg", "Adilabad", "Adipur", "Adityapur", "Adoni", "Adra Junction", "Aduturai", "Agartala", "Agas", "Agasod", "Aghwanpur", "Agomoni", "Agori Khas", "Agra Cantonment", "Agra City", "Agra Fort", "Ahalyapur", "Ahmadgarh", "Ahmednagar", "Ahmedpur Junction", "Ahmedabad", "Ahraura Road", "Airoli", "Aishbagh", "Ait", "Aithal", "Ajaibpur", "Ajanti", "Ajaraka", "Ajgain", "Ajhai", "Ajit", "Ajmer Junction", "Ajni", "Akalkot Road", "Akaltara", "Akanapet", "Akbarganj", "Akbarpur", "Akividu", "Akodia", "Akola Junction", "Akolner", "Akona", "Akot", "Akurdi", "Alamnagar", "Aler", "Algapur", "Algawan", "Alia Bada", "Aligarh Junction", "Alipurduar", "AlipurduarJunction", "Allahabad City", "Allahabad Junction", "Alappuzha", "Almatti", "AlnavarJunction", "Alniya", "Aluabari Road", "Alwar", "Aluva", "Amalner", "Amalsad", "Aman Vadi", "Amarpura", "Amausi", "Amb Andaura", "Ambagaon", "Ambala Cantonment", "Ambala City", "Ambalappuzha", "Ambale", "Ambari", "Ambari Falakata", "Ambarnath", "Ambassa", "Ambasamudram", "Ambattur", "Ambaturai", "Ambiapur", "Ambika Kalna", "Ambikapur", "Ambikeshwar", "Ambivli", "Ambli Road", "Ambliyasan", "Ambodala", "Ambur", "Amethi", "Amgaon", "Amguri", "Amla Junction", "Amlai", "Amlakhurd", "Amli", "Ammasandra", "Amoni", "Amravati", "Amreli", "Amritsar Junction", "Amritvel", "Amroha", "Anakapalle", "Anand Junction", "Anand Nagar", "Anand Vihar", "Anandpur Sahib", "Anandtandavpur", "Anantapur", "Anaparti", "Anara", "Anas", "Andal Junction", "Andheri", "Angadippuram", "Angamaly", "Angar", "Angul", "Anipur", "Anjangaon", "Anjani", "Anjar", "Anjhi Shahabad", "Ankai", "AnkleshwarJunction", "Ankola", "Annanur", "Annavaram", "Annigeri", "Anpara", "Antah", "Antu", "Anugraha Narayan Road", "Anupgarh", "AnuppurJunction", "Anupshahr", "Aonla", "Ara", "Arabagatta H", "Arakkonam Junction", "Araku", "Aralvaymozhi", "Arariya", "Arariya Court", "Arasur", "Aravalli Road", "Arunachal", "Aravankadu", "Ariyalur", "Argora", "Arjansar", "Arnetha", "Arni Road", "ArsikereJunction", "Aruppukottai", "Arvi", "Aryankavu", "Asafpur", "Asalpur Jobner", "Asangaon", "Asansol Junction", "Asaoti", "Ashok Nagar", "Asthal BoharJunction", "Aslana", "Aslaoda", "Asnoti", "Asokhar", "Asranada", "Atari", "Ataria", "Atarra", "Ateli", "Atgaon", "Athipattu", "Athipattu Pudhunagar", "Atrampur", "Atrauli Road", "Atru", "Attabira", "Attar", "Attur", "Aujari", "Aulenda", "Aunrihar Junction", "Aurangabad", "Auvaneswarem", "Auwa", "Avadi", "Ayodhya", "Azamgarh", "AzamnagarRoad", "Azara", "Azimganj City", "AzimganjJunction", "Babarpur", "Babatpur", "Bebejia", "Babhnan", "Babina", "Babrala", "Babugarh", "Babupeth", "Bacheli", "Bachhrawan", "Bachwara Junction", "Badmal", "Baad", "Badami", "Badampahar", "Badampudi", "Badurpur Ghat", "Badarpur Junction", "Badausa", "Badgam", "Badhada", "Badhal", "Badlapur", "Badli", "Badnapur", "Badnera Junction", "Badshahnagar", "Badshahpur", "Badwasi", "Bagaha", "Bagalkot", "Bagbahra", "Bagetar", "Bagevadi Rd", "Baghauli", "Baghora", "Bagra Tawa", "Bagri Nagar", "Bagri Sajjanpur", "Bagwali", "Bahadur Singh W", "Bahadurgarh", "Bahadurpur", "Baheri", "Bahilpurwa", "Bahirkhand", "Bahjoi", "Bahraich", "Baidyanathdham", "Baihata Chariali", "Baiguda", "Baijnathpur", "Baikunthpur Rd", "Bainchi / Boinchi", "Bairabi (Bhairabi)", "Bairapur", "Bairagnia", "Baitalpur", "Bajva", "Bakhtiyarpur Junction", "Bakra Road", "Balaghat", "Balamau Junction", "Balangir", "Balasore", "Balauda Takun", "Balawala", "Balawali", "Balharshah", "Baliakheri", "Balikotia", "Balipara", "Ballabhgarh", "Balli", "Ballia", "Ballupur", "Bally", "Ballygunge Junction", "Balrampur", "Balsamand", "Balugan", "Balwa", "Balwara", "Bamangachhi", "Bamanheri", "Bamhani", "Bamla", "Bamnia", "Bamsin", "Bamra", "Bamsin", "Bamuni Gaon", "Banahi", "Banapura", "Banar", "Banarhat", "Banas", "Banaswadi", "Banasandra", "Banbasa", "Banda Junction", "Bandakpur", "Bandanwara", "Bandarkhal", "Bandel Junction", "Bandh Bareta", "Bandikui Junction", "Bandra", "Bandra Terminus", "Bangalore Cantonment", "Bangalore City Junction", "Bangalore East", "Bangarapet", "Bangarapet", "Bangrod", "Bani", "Baniya Sanda DH", "Bankata", "Bankura", "Bankura", "Banmankhi Junction", "Banmor", "Bansdih Road", "Banshlai Bridge", "Bansi Paharpur", "Bansipur", "Banasthali Niwai", "Banta Raghunathgarh", "Bantawala", "Banthra", "Banwali", "Baori Thikria", "Bapatla", "Bar", "Bara Jamda", "Barabanki Junction", "Barabhum", "Barbil", "Baradwar", "Baragaon", "Barahu", "Baraigram Junction", "Barakar", "Baral", "Baramati", "Baran", "Baranagar", "Barara", "Barasat Junction", "Barauni Junction", "Barbatpur", "Barchi Road", "Barddhaman Junction", "Bardoli", "Bareilly", "Bareilly", "Bareilly Cantt", "Barejadi", "Bareta", "Bareth", "Bargarh Road", "Bargawan", "Barh", "Barhan Junction", "Barharwa Junction", "Barhiya", "Barhni", "Bari Brahman", "Bariarpur", "Barkakana", "Barkur", "Barlai", "Barmer", "Barnagar", "Barnala", "Barog", "Barpali", "Barpeta Road", "Barrackpore", "Barsathi", "Barsi Takli", "Barsi Town", "Barsoi Junction", "Barsola", "Barsuan", "Bartara", "Baruva", "Baruipur Junction", "Barwa Sagar", "Barwadih Junction", "Barwaha", "Barya Ram", "Basai", "Basar", "Basbari", "Basharatganj", "Basi Kiratpur", "Basin Bridge", "Basmat", "Basni", "Bassi Pathana", "Basta", "Basti", "Basugaon", "Baswa", "Batadrowa Road", "Batala Junction", "Bauria Junction", "Bavla", "Bawal", "Bawani Khera", "Bayana Junction", "Baytu", "Bazida Jatan", "Bazpur", "Bazurghat", "Beas", "Beawar", "Begunkodor", "Bedetti", "Begampet", "Begu Sarai", "Behtagokul", "Behula", "Bejnal", "Bela Tal", "Belampalli", "Belapur", "Belgahna", "Belgharia", "Belgaum", "Belha", "Bellary Junction", "Bellary Cantonment", "Belpahar", "Belrayan", "Belsiri", "Belthara Road", "Belur", "Belvandi", "Beohari", "Berchha", "Berhampore Court", "Brahmapur", "Besroli", "Betavad", "Bettiah", "Betul", "Bhabhar", "Bhabua Road", "Bhachau", "Bhachau BG", "Bhadan", "Bhadaura", "Bhadbhadaghat", "Bhadli", "Bhadohi", "Bhadra", "Bhadrachalam Road", "Bhadrak", "Bhadran", "Bhadravati", "Bhadroli", "Bhaga Junction", "Bhagalpur", "Bhagat Ki Kothi", "Bhagega", "Bhagtanwala", "Bhagwanpur", "Bhagwanpura", "Bhaini Khurd", "Bhairongarh", "Bhakti Nagar", "Bhalki", "Bhalumaska", "Bhanapur", "Bhandak", "Bhandara Road", "Bhandup", "Bhanga", "Bhankoda", "Bharat Kup", "Bharatkund", "Bharatpur Junction", "Bharatwada", "Bharthana", "Bharuch Junction", "Bharwa Sumerpur", "Bharwari", "Bhatel", "Bhatgaon", "Bhatinda Junction", "Bhatiya", "Bhatkal", "Bhatni Junction", "Bhaton Ki Gali", "Bhatpar Rani", "Bhatpur", "Bhattu", "Bhaunra", "Bhavnagar Para railway station", "Bhavani Nagar", "Bhavnagar Terminus railway station", "Bhawani Mandi", "Bhawanipatna", "Bhawanipur Kalan", "Bhayandar", "Bhayavadar", "Bheempura", "Bheerpur", "Bhemswadi", "Bheraghat", "Bhesana", "Bhigwan", "Bhilad", "Bhilai Power House", "Bhilainagar", "Bhilavdi", "Bhildi", "Bhilwara", "Bhimal", "Bhimana", "Bhimarlai", "Bhimasar", "Bhimavaram Junction", "Bhimavaram Town", "Bhimnath", "Bhimsen", "Bhind", "Bhinwaliya", "Bhitaura", "Bhivpuri Road", "Bhiwandi", "Bhiwani", "Bhiwani City", "Bhodwal Majri", "Bhogpur Sirwal", "Bhojipura Junction", "Bhojo", "Bhojras", "Bhojudih Junction", "Bhoke", "Bhone", "Bhongaon", "Bhongir", "Bhopal Bairagarh", "Bhopal Dewanganj", "Bhopal Habibganj", "Bhopal Junction", "Bhopal Mandideep", "Bhopal Misrod", "Bhopal Nishatpura", "Bhubaneswar", "Bhuj", "Bhupalsagar", "Bhupia Mau", "Bhusaval Junction", "Bhutakia Bhimsa", "Bhusaval", "Bibinagar Junction", "Bichia", "Bichpuri", "Bidadi", "Bidanpur", "Bidar", "Bidhan Nagar Road", "Bidupur", "Bidyadabri", "Bighapur", "Bihara", "Bihar Sharif", "Bihiya", "Bihta", "Bijainagar", "Bijapur", "Bijauli", "Bijaysota", "Bijni", "Bijnor", "Bijoor", "Bijora", "Bijrotha", "Bijuri", "Bikaner Junction", "Bikrampur", "Bilaspur", "Bilaspur Road", "Bildi", "Bilhar Ghat", "Bilhaur", "Bilimora Junction", "Bilkha", "Billi", "Bilpur", "Bilwai", "Bina Junction", "Binaur", "Bindki Road", "Binnaguri", "Bir", "Biradhwal", "Birambad", "Birang Khera", "Birapatti", "Birlanagar", "Birmitrapur", "Birohe", "Biroliya", "Birsinghpur", "Birur Junction", "Bisalwas Kalan", "Bishengarh", "Bishnathganj", "Bishnupur", "Bishrampur", "Bissam Cuttack", "Bissau", "Biswa Bridge", "Biswan", "Biyavra", "Biyavra Rajgarh", "Bobas", "Bobbili Junction", "Bodeli", "Bodhan", "Bodwad", "Boinda", "Boisar", "Bokajan", "Bokaro Steel City", "Bokaro Thermal", "Boko", "Bolai", "Bolarum", "Bolda", "Bolpur — Santiniketan", "Bommidi", "Bongaigaon", "Borawar", "Bordhal", "Bordi", "Bordi Road", "Borgaon", "Borivali", "Borra Guhalu", "Borvihir", "Botad Junction", "Boxirhat", "Brahmavart", "Brajarajnagar", "Brayla Chaurasi", "Budalur", "Budaun", "Budhi", "Budhlada", "Budni", "Bulandshahr", "Bundi", "Bundki", "Burdwan", "Burhanpur", "Burhar", "Burhwal", "Burnpur", "Butari", "Butewala", "Buxar", "Byadarahalli", "Byculla", "Boridand", "Birati", "Barai Jalalpur", "Bangaon Junction", "B B D Bag", "Budge Budge", "Bamangachi", "Bira", "Bidhutibhushan Halt", "Belur", "Belur Math", "Bisharpara Kodaliya", "Baghbazar", "Barabazaar", "Birnagar", "C Shahumaharaj T", "Kozhikode", "Canacona", "Kannur", "Cannanore South", "Cansaulim", "Carmelaram (Sarjapur Road, Bangalore)", "Castle Rock", "CBD Belapur", "Chandanathope", "Chabua", "Chachaura Bngj", "Chadotar", "Chaibasa", "Chainwa", "Chajawa", "Chajli", "Chakdaha", "Chakdayala", "Chakehri(Kanpur)", "Chakia", "Chakradharpur", "Chakraj Mal", "Chaksu", "Chakulia", "Chalakudy", "Chalala", "Chalisgaon Junction", "Challakere", "Chalthan", "Chamagram", "Chamarajanagar", "Champa", "Champaner Rd Junction", "Chamraura", "Chand Siau", "Chanda Fort", "Chandan Nagar", "Chandar", "Chandari(Kanpur)", "Chandauli Majhwar", "Chandausi Junction", "Chandawal", "Chanderiya", "Chandi Mandir", "Chandia Road", "Chandigarh", "Chandil Junction", "Chandiposi", "Chandisar", "Chandkhira Bagn", "Chandlodiya", "Chandok", "Chandranathpur", "Chandrapur", "Chandrapura", "Chandresal", "Chandur", "Chaneti", "Changanacheri", "Changsari", "Channani", "Channapatna", "Chanpatia", "Chaparmukh Junction", "Chaprakata", "Charaud", "Charbagh", "Charbatia", "Charbhuja Road", "Chargola", "Charkhari Road", "Charkhi Dadri", "Charni Road", "Charvattur", "Chata", "Chau Mahla", "Chaube", "Chaukhandi", "Chaunrah", "Chaurakheri", "Chaure Bazar", "Chauri Chaura", "Chausa", "Chautara", "Chauth Ka Brwra", "Chavalkhede", "Chawapall", "Chaygaon", "Chemancheri", "Chembur", "Chengalpattu", "Chengannur", "Chennai Beach", "Chennai Central", "Chennai Egmore", "Chennai Fort", "Chennai Park", "Cheriyanad", "Cherthala", "Chetar", "Chettinad", "Chhabra Gugor", "Chhandrauli", "Chhansara", "Chhapi", "Chhapra", "Chhapra Kacheri", "Chharodi", "Chhatrapati Shivaji Terminus", "Chhatarpur", "Chhatrapur", "Chhidgaon", "Chhina", "Chhindwara Junction", "Chhipadohar", "Chhitauni", "Chhota Gudha", "Chhoti Odai", "Chianki", "Chidambaram", "Chiheru", "Chikballapur", "Chikkamagaluru", "Chikalthan", "Chikjajur Junction", "Chikni Road", "Chikodi Road", "Chilbila Junction", "Chilka", "Chilo", "Chinchli", "Chinchpada", "Chinchpokli", "Chinchwad", "Chinna Ganjam", "Chinna Salem", "Chintamani", "Chiplun", "Chipurupalle", "Chirai", "Chirala", "Chirawa", "Chirayinkil", "Chirgaon", "Chirmiri", "Chit Baragaon", "Chitahra", "Chital", "Chitali", "Chitradurga", "Chitrakuta", "Chitrapur", "Chitrasani", "Chitrawad", "Chitrod", "Chitapur", "Chittaranjan", "Chittaurgarh", "Chittoor", "Chodiala", "Choki Sorath", "Chola", "Cholang", "Chomun Samod", "Chondi", "Chopan", "Choral", "Chorvad Road", "Chosla", "Choti Khatu", "Chuchura", "Chuda", "Chunabhatti", "Chunar", "Churchgate", "Churk", "Churu", "Clutterbuckganj", "Cochin Harbour Terminus", "Coimbatore Junction", "Coimbatore North Junction", "Colonelganj", "Contai Road", "Coonoor", "Cotton Green", "Cuddalore Junction", "Cuddalore Port", "Cuddapah", "Cumbum", "Cuttack", "Currey Road", "Dabhaura", "Dabhoi Junction", "Dabilpur", "Dabla", "Dabli Rathan", "Dabolim", "Dabra (Gwalior)", "Dabtara", "Dadar (Western Railway)", "Dadar (Central Railway)", "Dadri", "Dagaon", "Dagmagpur", "Dahanu Road", "Dahar Ka Balaji", "Dahina Zainabad", "Dahisar", "Dahod", "Dailwara", "Dakaniya Talav", "Dakhineswar", "Dakor", "Daladi", "Dalauda", "Dalelnagar", "Dalgaon", "Daliganj", "Dalhousie Road", "Dalkhola", "Dalli-Rajhara", "Dalmau Junction", "Dalmera", "Dalpatpur", "Dalsingh Sarai", "Daltonganj", "Damanjodi", "Damchara", "Damnagar", "Damoh", "Danapur", "Dandeli", "Dandupur", "Dangoaposi", "Dangtal", "Daniyawan Bzr H", "Dankaur", "Dankuni", "Danwar", "Dapodi", "Dappar", "Daotuhaja", "Dara", "Daraganj", "Darbhanga Junction", "Darjeeling", "Darritola", "Daryabad", "Daryapur", "Dasna", "Dasuya", "Datia", "Dativali", "Daudpur", "Daulatabad", "Daund Junction", "Daundaj", "Daurai", "Daurala", "Dauram Madhpura", "Dausa", "Dausni", "Davangere", "Dayalpur", "Debari", "Debipur", "Degana Junction", "Dehradun", "Dehri On Sone", "Dehu Road", "Dekapam", "Delhi", "Delhi MG", "Delhi Azadpur", "Delhi Cantonment", "Delhi Kishanganj", "Delhi Sarai Rohilla", "Delhi Safdarjung", "Delhi Shahdara", "Delvada", "Demu", "Deoband", "Deogan Road", "Deoghar Junction", "Deorakot", "Deoria Sadar", "Depalsar", "Derol", "Desari", "Deshalpar", "Deshnok", "Deswal", "Detroj", "Devakottai Road", "Devbaloda Charoda", "Devgam", "Devgarh Madriya", "Devlali", "Devpura", "Dewalgaon", "Dewanganj", "Dewas", "Dhaban", "Dhalaibil", "Dhalgaon", "Dhalpukhuri", "Dhamangaon", "Dhamni", "Dhamora", "Dhampur", "Dhamtari", "Dhamua", "Dhana Kherli", "Dhanakwada", "Dhanakya", "Dhanari", "Dhanawala Wada", "Dhanbad Junction", "Dhandari Kalan", "Dhandhera", "Dhandhuka", "Dhanera", "Dhaneta", "Dhangadra", "Dhanmandal", "Dharamtul", "Dharangaon", "Dhareshwar", "Dhari Junction", "Dhariwal", "Dharmabad", "Dharmanagar", "Dharmapuri", "Dharmavaram Junction", "Dharmpur Himachal", "Dharnaoda", "Dharwad", "Dhasa Junction", "Dhaulpur", "Dhaura", "Dheena", "Dhekiajili Road", "Dhemaji", "Dhenkanal", "Dhilwan", "Dhinda", "Dhindhora HKMKD", "Dhindsa", "Dhing", "Dhing Bazar", "Dhinoj", "Dhirera", "Dhirganj", "Dhirpur", "Dhoda Khedi", "Dhodhar", "Dhodra Mohar", "Dhola Junction", "Dhola Mazra", "Dholi", "Dholka", "Dhondi", "Dhoraji", "Dhrangadhra Junction", "Dhubri", "Dhule", "Dhulghat", "Dhulkot", "Dhup Dhara", "Dhupguri", "Dhuri Junction", "Dibai", "Dibrugarh", "Dibrugarh Town", "Dichpalli", "Didwana", "Digaru", "Digboi", "Dighwara", "Digod", "Dihakho", "Dilawarnagar", "Dildarnagar Junction", "Dimapur", "Dimow", "Dina Nagar", "Dinagaon", "Dindigul Junction", "Dingwahi", "Dipa", "Diphu", "Diplana", "Dipore", "Disa", "Ditokcherra", "Diva Junction", "Divine Nagar", "Diwana", "Diwankhavati", "Diyodar", "Dobh Bahali", "Dockyard Road", "Dodballapur", "Dodbele", "Dohrighat", "Doiwala", "Dolavli", "Dombivli", "Domingarh", "Donakonda", "Dondaicha", "Dongargaon", "Dongargarh", "Donigal", "Doraha", "Doravart Chtram", "Dornakal Junction", "Dronachalam Junction", "Dubaha", "Dubia", "Duddhinagar", "Dudh Sagar", "Dudhsagar Waterfalls", "Dudhani", "Dudhia Khurd", "Dudhnoi", "Dudhwakhara", "Dudia", "Dudwindi", "Duganpur", "Dugdol", "Duggirala", "Duhai", "Duliajan", "Dullabcherra", "Dullahapur", "Dulrasar", "Dum Dum", "Dum Dum Cantonment", "Dumariya", "Dumraon", "Dumka", "Dumuriput", "Dundara", "Dundlod MKDGRH", "Dungar Junction", "Dungarpur", "Duraundha Junction", "Durgauti", "Durg", "Durgapur", "Duttapukur", "Durgapura", "Duskheda", "Duvvada", "Dwarka", "Dwarkaganj", "Ekambara kuppam", "Ekangarsarai", "Ekchari", "Ekma", "Ekma", "Elamanur", "Yelamanchili", "Ellenabad", "Eluru", "[[(Ennore) railway station|]]", "Eraligu", "Eraniel", "Eravipuram", "Ernakulam Junction", "Ernakulam Town", "Ernakulam Terminus", "Erode Junction", "Etah", "Etawah", "Ettimadai(Coimbatore)", "Etmadpur", "Etakkot", "Faizabad Junction", "Faizullapur", "Fakhrabad", "Fakiragram Junction", "Falakata", "Falna", "Farah Town", "Farhedi", "Faridabad", "Faridabad New Town", "Faridkot", "Farrukhabad", "Farrukhabad", "Fateh Singhpura", "Fatehabad Chandrawati Ganj Junction", "Fatehgarh", "Fatehgarh Sahib", "Fatehnagar", "Fatehpur", "Fatehpur Sikri", "Fatehpur Sekhawati", "Fatuha", "Fazalpur", "Fazilka", "Ferok", "Firozabad", "Firozpur Cant.", "Firozpur City", "Forbesganj", "Furkating Junction", "Fursatganj", "", "Gachhipura", "Gadag Junction", "Gadarwara", "Gadhakda", "Gadra Road", "Gadwal", "Gahmar", "Gainjahwa", "Gainsari Junction", "Gaipura", "Gajraula Junction", "Galan", "Gambhiri Road", "Ganagapur Road", "Ganj Dundwara", "Ganaur", "Gandhi SMRAK_RD", "Gandhidham BG", "Gandhidham Junction", "Gandhigram", "Gandhinagar JPR", "Gandhinagar Capital", "Ganeshganj", "Gangaganj", "Gangakher", "Gangapur City", "Gangarampur", "Gangrar", "Gangsar Jaitu", "Ganj basoda", "Ganjmuradabad", "Gannavaram", "Garhi Harsaru", "Garhi Manikpur", "Garhmuktesar", "Garhmuktesar BR", "Garhwa", "Garot", "Garwa Road", "Gaura", "Gauri Bazar", "Gauri Phanta", "Gauribidanur", "Gauriganj", "Gauripur", "Gauriyamau", "Gaushala", "Gautampura Road", "Gaya Junction", "Geratpur", "Gerita Kolvada", "Gevra Road", "Gevrai", "Ghagghar", "Ghagwal", "Ghanauli", "Ghansoli", "Gharaunda", "Ghaso", "Ghataka Varana", "Ghatampur", "Ghatkopar", "Ghatprabha", "Ghatsila", "Ghaziabad Jn", "Ghazipur City", "Ghograpur", "Gholvad", "Ghoradongri", "Ghorawadi", "Ghorpuri", "Ghosipura", "Ghosunda", "Ghughuli", "Ghugus", "Ghutai", "Gidarpindi", "Giddalur", "Giddarbaha", "Gidhaur", "Gir Gadhara", "Gir Hadmatiya", "Giridih", "Girwar", "Goalpara Town", "Godha", "Godhra Junction", "Gogameri", "Gogamukh", "Gohad Road", "Gohana", "Gohpur", "Gokak Road", "Gokarna Road", "Gola Gokarannath", "Gola Road", "Golakganj Junction", "Golanthra", "Gole", "Golsar", "Gomati Nagar", "Gomoh Junction", "Gonda Junction", "Gondal", "Gondia Junction", "Goneana", "Gooty", "Gop Jam", "Gopalganj", "Gopalpur", "Gora Ghuma", "Gorakhpur Cantonment", "Gorakhpur City", "Gorakhpur Junction", "Goram Ghat", "Ghorasahan", "Goraul", "Goraya", "Goregaon", "Goregaon Road Halt", "Goresuar", "Goriyan", "Goshainganj", "Gossaigaon Hat", "Gotan", "Gotegaon", "Gothaj", "Govandi", "Goverdhan", "Govindgarh", "Govindgarh Malk", "Govindi Marwar", "Govindnagar", "Govindpuri", "Govindpuri, Kanpur", "Grant Road", "Gudha", "Guindy", "Gubbi", "Gudivada Junction", "Gudiyattam", "Gudur Junction", "Gujhandi", "Gulabhganj", "Gulabpura", "Gulaothi", "Gularbhoj", "Gulbarga", "Guldhar", "Guledagudda Rd", "Guler", "Gulzarbagh", "Guma", "Gumia", "Gumman", "Gummidipundi", "Gumthal", "Guna", "Gundardehi", "Guneru Bamori", "Guntakal Junction", "Guntur Junction", "Guptipara", "Guraru", "Gurap", "Gurdaspur", "Gurgaon", "Gurhi", "Guriya", "Gurla", "Gurmura", "Gurpa", "Gursahaiganj", "Gursar Shnewala", "Gauravpur", "Guru Tegh Bahadur Nagar", "Guruvayur", "Guwahati", "Gwalior", "Gyanpur Road", "Habaipur", "Habibganj", "Habibwala", "Habra", "Hadapsar", "Hadmadiya", "Hadmatiya Junction", "Hafizpur", "Haflong Hill", "Haiaghat", "Haibargaon", "Haidergarh", "Hailakandi", "Hajipur Junction", "Hakimpur", "Haldaur", "Haldi Road", "Haldibari", "Haldwani", "Halisahar", "Halvad", "Hamira", "Hamirgarh", "Hamirpur Road", "Hanakere", "Handia Khas", "Hansi", "Hansiawas", "Hanumangarh Junction", "Hanumangarh Town", "Hanwant", "Hapa", "Hapa Road", "Hapur Junction", "Harangajao", "Harangul", "Haranya Kheri", "Harauni", "Harwada", "Harwada", "Harda", "Hardoi", "Harduaganj", "Haridwar", "Harihar", "Harinagar", "Haripad", "Haripur", "Haripur Gram", "Harischandrapur", "Harishanker Road", "Harisinga", "Harkia Khal", "Harmuti", "Harnaut", "Harpalganj", "Harpalpur", "Harrawala", "Harsauli", "Harsud", "Harthala", "Harwada", "Hasimara", "Hassan Junction", "Hasanparthi Road", "Hathbandh", "Hathidah Junction", "Hathigadh", "Hathras City", "Hathras Junction", "Hathras Road", "Hathras Qilla", "Hatia", "Hatikhali", "Hatkanagale", "Hatundi", "Haveri", "Hazaribagh Road", "Hazrat Nizamuddin", "Hejjala", "Helak", "Helem", "Hempur", "Hendegir", "Hilara", "Hilsa", "Himayatnagar", "Himmatnagar Junction", "Hindaun City", "Hind Motor", "Hindu College", "Hindumalkote", "Hindupur", "Hinganghat", "Hingoli Deccan", "Hira Nagar", "Hirakud", "Hirapur", "Hirdagarh", "Hirnoda", "Hisar", "Hisvahal", "Hodal", "Hojai", "Hol", "Holambi Kalan", "Hole Alur", "Honnavar", "Hooghly", "Hooghly Ghat", "Homnabad", "Hosdurga Road", "Hoshangabad", "Hoshiarpur", "Hosapete Junction", "Hosur", "Hotgi Junction", "Howbagh Jabalpur", "Howrah Junction", "Hubli Junction", "Hugrajuli", "Husainpur", "Hyderabad Deccan", "Ib", "Ichapur", "Ichapuram", "Ichauli", "Idar", "Idgah Agra Junction", "Igatpuri", "Ikkar", "Iklehra", "Inchhapuri", "Indalvai", "Indapur", "Indara Junction", "Indargarh", "Indi Road", "Indore Junction (BG)", "Indore Junction (MG)", "Innanje", "Intikanne", "Intiyathok", "Itehar", "Iqbal Gadh", "Iqbalpur", "Irinjalakuda", "Irugur(Coimbatore)", "Isarda", "Islampur", "Ismaila Haryana", "Itarsi Junction", "Itola", "Itwari", "Izzatnagar", "Jabalpur", "Jabli", "Jabri", "Jadar", "Jadcherla", "Jagadhri", "Jagadhri Workshop", "Jagadishpur", "Jagaddal", "Jessore Road", "Jagatbela", "Jagdalpur", "Jagdevwala", "Jagesharganj", "Jagi road", "Jagnath Road Halt", "Jagraon", "Jahanikhera", "Jaipur", "Jais", "Jaisalmer", "Jaithari", "Jaitipur", "Jaitwar", "Jajiwal", "Jajpur Kheonjhar Road", "Jakhal Junction", "Jakhalabandha", "Jakhalaun", "Jakhania", "Jakhaura", "Jakhim", "Jakhvada", "Jaksi", "Jalalganj", "Jalalpur Dhai", "Jalamb Junction", "Jalandhar Cantonment", "Jalandhar City", "Jalesar Road", "Jaleswar", "Jalgaon Junction", "Jalila Road", "Jaliya Devani", "Jalna", "Jalor", "Jalpaiguri", "Jalpaiguri Road", "Jalsu", "Jalsu Nanak", "Jam Jodhpur Junction", "Jam Wanthali", "Jamalpur Junction", "Jambara", "Jambur", "Jamira", "Jammalamadugu", "Jammikunta", "Jammu Tawi", "Jamnagar", "Jamsar", "Jamtara", "Jamui", "Jamunamukh", "Jamwala", "Janakpur Road", "Jandiala", "Jangaon", "Janghai Junction", "Jangipur Road", "Janiyana", "Jankampet Junction", "Jaora", "Japla", "Jarandeshwar", "Jargaon", "Jari", "Jaruda Naraa", "Jarwal Road", "Jasia", "Jasali", "Jasidih Junction", "Jasra", "Jaswantgarh", "Jaswantnagar", "Jataula Samphka", "Jath Road", "Jatinga", "Jatusana", "Jaulka", "Jaunpur City Railway Station", "Jaunpur Junction", "Javale", "Jawad Road", "Jawai Bandh", "Jawali", "Jawalamukhi Road", "Jayasingpur", "Jaynagar", "Jaynagar Majlipur", "Jehanabad", "Jejuri", "Jenal", "Jeonathpur", "Jetalsar Junction", "Jetalvad", "Jetpur", "Jeur", "Jagannath Temple Gate", "Jhadupudi", "Jhagadiya Junction", "Jhajha", "Jhalawar Road", "Jhalida", "Jhanjharpur", "Jhansi Junction", "Jhargram", "Jharia", "Jharokhas", "Jharsuguda Junction", "Jharwasaa", "Jhingura", "Jhinjhak", "Jhunjhunu", "Jhunpa", "Jigna", "Jind Junction", "Jira Road", "Jiradei", "Jiribam", "Jirighat", "Jiron", "Jiyapuram", "Jodhpur Junction", "Jogbani", "Jogeshwari", "Jogi Magra", "Jogidih", "Jogighopa", "Joginder Nagar", "Jogiwala", "Jolarpettai Junction", "Jone Karrang", "Joravaragar", "Jorhat", "Jorhat Town", "Jotana", "Joychandi Pahar railway station", "Juchandra", "Jugijan", "Juinagar", "Jukehi", "Julana", "Junagadh C B", "Junagadh Junction", "Jung Bahadurganj", "Junichavand", "Junnor Deo", "Juriagaon", "Jutogh", "Jwalapur", "Kacheguda", "Kachhwa Road", "Kadalundi", "Kadambur", "Kadaynallur", "Kadiri", "Kadur Junction", "Kaithalkuchi", "Kakinada Port", "Kakinada Town", "Kankinara", "Kalachand", "Kalamboli", "Kalanaur kalan", "Kalka", "Kalkalighat", "Kalwa", "Kalyan", "Kalyani", "Kalyanpur(Kanpur)", "Kalyanadurg", "Kalinarayanpur Junction", "Kalol Junction", "Kamakhya Junction", "Kaman Road", "Kamareddi", "Kampil Road", "Kamshet", "Kamakhya Junction", "Kampur", "Kamrup Khetri", "Kanaibazar", "Kanakpura", "Kanchausi", "Kanchipuram", "Kandivali", "Kangra", "Kanhangad", "Kanina Khas", "Kaniyapuram", "Kanjiramittam", "Kanjurmarg", "Kankanadi", "Kannauj", "Kanpur Anwarganj", "Kanpur Central", "Kanpur Rooma", "Kanpur SMU CBSA CPSM", "Kanpur Govindpuri Railway Station", "Kanpur Panki", "Kanpur Bridge Left Bank", "Kanyakumari", "Kapurthala", "Karad", "Karaikkudi Junction", "Karanja", "Karchha", "Karimganj Junction", "Karimnagar", "Karjat", "Karmali", "Karnal", "Karur Junction", "Karunagappalli", "Karwar", "Kasara", "Kasaragod", "Kashi", "Kashipur", "Katakhal Junction", "Kathgodam", "Kathivakkam", "Kathua", "Katihar", "Katlicherra", "Katni", "Katol", "Katpadi Junction, Vellore", "Katra", "Kavali", "Kayamkulam", "Kayasthagram", "Kazhakoottam TechnoPark Trivandrum", "Kazipet Junction", "Kelavli", "Kelve Road", "Kendukana", "Kengeri", "Kesinga", "Kesamudram", "Khadavli", "Khadki", "Khairthal", "Khajuraho", "Khalilpur", "Khambhaliya", "Khamgaon", "Khamkhed", "Khammam", "Khana Junction", "Khandala", "Khandeshwar", "Khandwa", "Khanna", "Kharagpur Junction", "Kharbao", "Khardi", "Kharghar", "Khar Road", "Khatauli", "Khatu", "Khed", "Khera Kalan", "Khopoli", "Khurai", "Kinwat", "Kirakat railway station", "Kirloskarvadi", "Kirnahar", "Kilikolloor", "King's Circle", "Kishanganj", "Kiul Junction", "Kochuveli (Trivandrum /Thiruvananthapuram)", "Kodaikanal road", "Koderma", "Kodinar", "Kodumudi", "Koduru", "Kokrajhar", "Kolar", "Kollidam", "Kolhapur", "Kolad", "Kolkata Railway Station", "Kollam Junction", "Konnagar", "Kopar", "Kopargaon", "Kopar Khairane", "Koraput Junction", "Korattiangadi", "Korattur", "Korba", "Koregaon", "Korukkupet", "Kosamba", "Kosi Kalan", "Kosli", "Kotdwar", "Kot Kapura", "Kota Junction", "Kotli Kalan", "Kotma", "Kotshila Junction", "Kottapalli", "Kottavalasa", "Kottayam", "Kottarakkara", "Kotikulam", "Kotturu", "Kovilpatti", "Koyilandy", "Kozhikode", "Krishna", "Krishna Canal", "Krishnai", "Krishnarajapuram", "Kuchaman City", "Kudal", "Kulitalai", "Kulpahar", "Kulti", "Kulukkallur", "Kumgaon Burti", "Kumbakonam", "Kumta", "Kundapura", "Kuppam", "Kuram", "Kuri", "Kurichedu", "Kurduvadi", "Kurla", "Kurnool Town", "Kurukshetra Junction", "Kuttippuram", "Khurda Road", "kursela", "katihar", "Laban", "Labha", "Labhpur", "Lachhipura", "Lachhmangarh SK", "Lachhmanpur", "Lachyan", "Ladhowal", "Ladnun", "Laheria Sarai", "Lahli", "Laimekuri", "Lakadiya", "Lakheri", "Lakhimpur", "Lakhminia", "Lakhnauria", "Lakhtar", "Lakkidi", "Laksar Junction", "Lakshmibai Nagar", "Lal Kuan", "Lalabazar", "Lalapet", "Lalganj", "Lalgarh Junction", "Lalgopalganj", "Lalgudi", "Lalitpur", "Lalkuan Junction", "Lalpur", "Lalpur Chandra", "Lalpur Jam", "Lalpur Umri", "Lalru", "Lamana", "Lambhua", "Lambiya", "Lamsakhang", "Landaura", "Langting", "Lanka", "Laopani", "Lar Road", "Lasalgaon", "Lasur", "Latehar", "Lathi", "Latur", "Latur Road", "Laukaha Bazar", "Laul", "Lawa Sardargarh", "Ledarmer", "Lehra Gaga", "Lidhora Khurd", "Liliya Mota", "Limbdi", "Limkheda", "Linch", "Lingampalli", "Liluah", "Lodipur Bishnpr", "Loha", "Loharu", "Loharwara", "Lohian Khas Junction", "Lohna Road", "Lohogad", "Loisingha", "Lokmanya Tilak Terminus", "Lonand", "Lonavala", "Londa Junction", "Loni", "Lorwada", "Lower Haflong", "Lower Parel", "Lowjee", "Luckeesarai Junction", "Lucknow Junction", "Lucknow", "Lucknow City", "Ludhiana Junction", "Lumding Junction", "Lunavada", "Luni Junction", "Luni Richha", "Lunidhar", "Lunkaransar", "Lusa", "Lusadiya", "Lushala", "Lalgola", "Macharya", "Machavaram", "Machavaram", "Machelipatnam", "Macherla", "Madan Mahal", "Madanapalle Rd", "Madanpur", "Maddur", "Madhavnagar", "Madukarai(Coimbatore)", "Madurai", "Madgaon", "Mithlanchal Deep", "Madha", "Madhabpur", "Madhapar", "Madhapur Road", "Madhi", "Madhira", "Madhopur Punjab", "Madhorajpur", "Madhosingh", "Madhubani", "Madhupur Junction", "Madurai Junction", "Madurantakam", "Madure", "Maghar", "Mahadanapuram", "Mahadevpara", "Mahajan", "Mahalam", "Mahalaxmi", "Mahamandir", "Mahansar", "Mahasamund", "Mahbubabad", "Mahbubnagar", "Mahe", "Maheji", "Mahendragarh", "Mahes Khunt", "Mahesana Junction", "Maheshmunda", "Mahidpur Road", "Mahim", "Mahisgaon", "Mahmudabad Avdh", "Mahmudpur SRYN", "Mahoba", "Maholi", "Mahpur", "Mahuamilan", "Mahuariya", "Mahuda Junction", "Mahugarha", "Mahur", "Mahuva Junction", "Maibang", "Maihar", "Maikalganj", "Mailani", "Mailongdisa", "Mainpuri", "Mairabari", "Mairwa", "Majbat", "Majgaon", "Majhagawan", "Majhola Pakarya", "Majorda", "Makhu", "Makrana Junction", "Makrera", "Makronia", "Maksi", "Malad", "Malarna", "Malavli", "Malda Town", "Malerkotla", "Malethu Kanak", "Malhargarh", "Malhour", "Malihabad", "Malipur", "Maliya Hatina", "Maliya Miyana", "Malkapur", "Malkhaid Road", "Malkisar", "Mallanwala Khas", "Malleswaram", "Malliyam", "Malout", "Malpura", "Malsailu", "Malsian Shahkht", "Malugur", "Malur", "Malwan", "Malwara", "Maman", "Manaksar", "Manamadurai Junction", "Mananpur", "Manaparai", "Manauri", "Manavadar", "Mancherial", "Mancheswar", "Manda Road", "Mandagere", "Mandal[disambiguation needed]", "Mandalgarh", "Mandapam", "Mandapam Camp", "Mandar Hill", "Mandasa Road", "Mandasor", "Manderdisa", "Mandhana Junction, Kanpur", "Mandi Adampur", "Mandi Bamora", "Mandi Dabwali", "Mandi Dhanaura", "Mandi Dip", "Mandla Fort", "Mandor", "Mandrak", "Manduadih", "Mandya", "Manendragarh", "Mangalagiri", "Mangaliyawas", "Mangaluru Central", "Mangaluru Junction", "Mangaon", "Mangliya Gaon", "Mangolpuri", "Mangra", "Manheru", "Manigachi", "Manikpur Junction", "Maninagar", "Manipur Bagan", "Vanchi Maniyachchi Junction", "Manjeshwar", "Mankapur Junction", "Mankar", "Mankarai", "Mankatha", "Mankhurd", "Manki", "Manmad Junction", "Mannanur", "Manoharganj", "Manoharpur", "Mansa", "Mansarovar", "Mansi Junction", "Mansurpur", "Manthralayam Road", "Manuguru", "Manwath Road", "Manzurgarhi", "Marahra", "Maramjhiri", "Marauda", "Mariahu", "Mariani Junction", "Marikuppam", "Marine Lines", "Maripat", "Markapur Road", "Markundi", "Marmagao", "Maroli", "Marsul", "Marthipalayam", "Marwar Bagra", "Marwar Balia", "Marwar Bhinmal", "Marwar Birthi", "Marwar Chapri", "Marwar Junction", "Marwar Kori", "Marwar Lohwat", "Marwar Mathanya", "Marwar Ratanpur", "Masit", "Masjid Bunder", "Maskanwa", "Masodha", "Masrakh", "Masur", "Matana Buzurg", "Mataundh", "Mathura Cantonment", "Mathura Junction", "Matlabpur", "Matmari", "Mattancheri Halt", "Matunga", "Matunga Road", "Mau Aimma", "Mau Junction", "Mau Ranipur", "Maur", "Maval", "Mavelikara", "Mavli Junction", "Mayanoor", "Mayiladuturai Junction", "Mayyanad", "McCluskieganj", "Mecheda", "Medchal", "Meerut Cantonment", "Meerut City", "Meghnagar", "Mehnar Road", "Mehsi", "Meja Road", "Melmaruvattur", "Melusar", "Mendipathar", "Memari", "Meralgram", "Merta City", "Merta Road Junction", "Mettur", "Metupalaiyam", "Mettur Dam", "Mhasavad", "Mahemdavad Kheda Road", "Mhow", "Midnapore", "Migrendisa", "Mihinpurwa", "Mihrawan", "Milak", "Minjur", "Miraj Junction", "Miranpur Katra", "Mira Road", "Mirchadhori", "Mirhakur", "Mirthal", "Mirza", "Mirzapali", "Miryalaguda", "Mirzapur", "Misamari", "Misrauli", "Mitha", "Mithapur", "Miyagam Karjan", "Miyana", "Miyona ka Bara", "Modelgram", "Modinagar", "Modnimb", "Modpur", "Modran", "Moga", "Mohammadkhera", "Mohanlalganj", "Mohiuddinnagar", "Mohiuddinpur", "Mohol", "Mohri", "Mokalsar", "Mokama Junction", "Mokholi", "Monabari", "Monacherra", "Mondh", "Munger", "Monglajhora", "Moore Market Complex (Chennai Central Suburban)", "Moradabad", "Morak", "Morappur", "Morbi", "Mordar", "Morena", "Mori Bera", "Morinda", "Morthala", "Mota Jadra", "Moterjhar", "Moth", "Mothala", "Mothala Halt", "Motichur", "Bapudham Motihari", "Motipur", "Motipura Chauki", "Moula-Ali", "Muddanuru", "Mudkhed Junction", "Muftiganj", "Mughal Sarai Junction", "Muhammadabad", "Muirpur Road", "Mukerian", "Mukhtiar Balwar", "Muktsar", "Mukundarayapuram", "Muli Road", "Mulki", "Mullanpur", "Mulanur", "Multai", "Mulund", "Mumbai Central", "Mumbra", "Munabao", "Mundalaram", "Mundha Pande", "Mundhewadi", "Mungaoli", "Muniguda", "Munirabad", "Munroturuttu", "Mupa", "Muradnagar", "Murdeshwar", "Murdeshwar", "Muri", "Murkeongselek", "Murliganj", "Murshadpur", "Murshidabad", "Murtizapur Junction", "Musafir Khana", "Mustafabad", "Muttarasanallur", "Mutupet", "Muzaffarnagar", "Muzaffarpur Junction", "Muzzampur Narayan", "Mysuru Junction", "Naya Ghaziabad", "N J Ramanal", "Nabadwip Dham", "Nabha", "Nadauj", "Nadiad Junction", "Nandikoor", "Nadikudi", "Nagal", "Naganahalli", "Nagaon", "Nagappattinam junction", "Nagar", "Nagar Untari", "Nagercoil Junction", "Nagardevla", "Nagargali", "Nagari", "Nagaria Sadat", "Nagarur", "Nagaur", "Nagbhir Junction", "Nagda Junction", "Nagercoil Town", "Nagina", "Naglatula", "Nagore", "Nagpur", "Nagrota", "Naharkatiya", "Naharlagun", "Nahur", "Naigaon", "Naihati Junction", "Naikheri", "Naila", "Naini", "Nainpur Junction", "Najibabad Junction", "Nakodar Junction", "Nalanda", "Nala Sopara", "Nalbari", "Nalgonda", "Nalhati", "Naliya", "Naliya Cantonment", "Nalwar", "Namakkal", "Namburu", "Namkom", "Namli", "Namrup", "Nana", "Nana Bhamodra", "Nanaksar", "Nandalur", "Nandapur", "Hazur Sahib Nanded", "Nandganj", "Nandgaon", "Nandgaon Road", "Nandiambakkam", "Nandol Dehegam", "Nandura", "Nandurbar", "Nandyal Junction", "Nangal Dam", "Nangloi", "Nanguneri", "Nanjangud Town", "Nanpara Junction", "Naojan", "Napasar", "Nar Town", "Naraikkinar", "Naraina", "Narangi", "Naranjipur", "Narasapur", "Narasaraopet", "Narayanpet Road", "Narayanpur", "Narayanpur Anant", "Nardana", "Narela", "Nari Road", "Nariaoli", "Narkatiaganj Junction", "Narkher", "Narnaul", "Naroda", "Narsinghpur", "Narwana Junction", "Narwasi", "Nasik Road", "Nasirabad", "Nathdwara", "Nathwana", "Naugachia", "Nauganwan", "Naugarh", "Naupada Junction", "Nautanwa", "Navade Road", "Navagadh", "Navalur", "Navapur", "Navlakhi", "Navsari", "Nawa City", "Nawadah", "Nawagaon", "Nawalgarh", "Nawalgohan", "Naya Azadpur", "Naya Kharadia", "Naya Nangal", "Nayadupeta", "Nayagaon", "Naydongri", "Nazareth", "Nazirganj", "Nekonda", "Nellimaria", "Nellore", "Nemilichery", "Nemom", "Nenpur", "Nepalganj Road", "Nepanagar", "Neral", "Nergundi", "Neri", "Nerul", "Netawal", "New Alipurduar", "New Bhuj", "New Bhuj", "New Bongaigaon Junction", "New Cooch Behar", "New Delhi", "New Farakka Junction", "New Gitldada Junction", "New Guntur", "New Jalpaiguri", "New Mal Junction", "New Maynaguri", "New Misamari", "Neyveli", "Neyyattinkara", "Ngrjunanagaramu", "Nibhapur", "Nidadavolu Junction", "Nidamangalam Junction", "Nidubrolu", "Nigohan", "Nihalgarh", "Nilaje", "Nilambazar", "Nilambur Road", "Nileshwar", "Nilokheri", "Nim Ka Thana", "Nimach", "Nimar Kheri", "Nimbahera", "Nimbhora", "Nimtita", "Nindhar Benar", "Ningala Junction", "Nipani Vadgaon", "Niphad", "Nira", "Nirakarpur", "Nirmali", "Nisui", "Nivari", "Nivasar", "Nizamabad", "Nizampur", "Nizbarganj", "Nizchatia", "Noamundi", "Nohar", "Nokha", "Nomoda", "Nonera", "Norla Road", "North Lakhimpur", "Nosaria", "Nowrozabad", "Noyal", "Narayanpur Tatwar", "Nua", "Nunkhar", "Nurmahal", "Okha", "Old Delhi Junction", "Old Malda Junction", "Omkareshwar Road", "Ondagram", "Ongole", "Ontimitta", "Orai", "Ottapalam", "Oorgaum", "Pabai", "Pabli Khas", "Pachrukhi", "Pachhapur", "Pachor Road", "Pachora Junction", "Paddhari", "Padhegaon", "Padrauna", "Padse", "Padubidri", "Pagara", "Pahara", "Paharpur", "Pajian", "Pakala Junction", "Pakki", "Pakur", "Palachauri", "Palam", "Palampur Himachal", "Palampur HP OA", "Palana", "Palani", "Palanpur Junction", "Palappuram", "Palasa", "Palasdari", "Paldhi", "Pahlejaghat Junction", "Palej", "Palghar", "Palakkad Junction", "Palakkad Town", "Palakollu", "Pali Marwar", "Palia", "Palia Kalan", "Palitana", "Palpara", "Palsana", "Palsora Makrawa", "Palwal", "Pamban Junction", "Panagarh", "Panbari", "Panch Pipila", "Panch Rukhi", "Pancharatna", "Panchgram", "Panchtalavda Rd", "Pandavapura", "Pandaravadai", "Pandharpur", "Pandhurna", "Pandoli", "Paneli Moti", "Paniahwa", "Panikhaiti", "Panipat Junction", "Panitola", "Panjhan", "Panki, Kanpur", "Panruti", "Panskura Junction", "Pantnagar", "Panvel", "Papanasam", "Paradgaon", "Paralakhemundi", "Paramakkudi", "Paras", "Parasia", "Parasnath Station", "Paravur", "Parbati", "Parbhani Junction", "Pardhande", "Pardi", "Parel", "Parhihara", "Parkham", "Parli", "Parli Vaijnath", "Parlu", "Parappanangadi", "Parsa Bazar", "Parsa Khera", "Parsabad", "Parsipur", "Parsoda", "Partapgarh Junction", "Partapur, Uttar Pradesh", "Partur", "Parvatipuram", "Parvatipuram Town", "Pasur", "Patal Pani", "Patan", "Patara", "Patas", "Pataudi Road", "Pathankot Junction", "Pathankot Cantt", "Pathardih Junction", "Patharkandi", "Patharkhola S", "Patharia", "Pathauli", "Pathri", "Pathsala", "Patiala", "Patiladaha", "Patli", "Patna Junction", "Patna Saheb", "Patranga", "Patratu", "Patsul", "Pattabiram", "Pattabiram West", "Pattabiram East Depot", "Pattambi", "Pattaravakkam", "Patti", "Pavur Chatram", "Pawapuri Road", "Payagpur", "Payangadi", "Payyanur", "Payyoli", "Peddapalli", "Pendra Road", "Penganga", "Penukonda", "Perambur", "Perambur Carriage Works", "Perambur Loco Works", "Pernem", "Perugamani", "Petlad Junction", "Pethanaickenpalayam", "Pettaivayatalai", "Phagwara Junction", "Phakhoagram", "Phalodi", "Phanda", "Phaphamau Junction", "Phaphund", "Phephna Junction", "Phesar", "Phillaur Junction", "Phulad", "Phulaguri", "Phulera Junction", "Phulpur", "Pij", "Pilamedu(Coimbatore)", "Pili Bangan", "Pilibhit Junction", "Pilioda", "Pilkhua", "Pimpar Khed", "Pimpri", "Pindra Road", "Pingleshwar", "Pipalda Road", "Pipalsana", "Pipar Road Junction", "Pipariya", "Piparpur", "Piparsand", "Piplaj", "Piplee", "Piplia", "Piplod Junction", "Piploda Bagla", "Pipraich", "Pipraigaon", "Piprala", "Pipri Dih", "Pirjhalar", "Pirpainti", "Pirthiganj", "Pirumadara", "Pirwa", "Pitambarpur", "Pithapuram", "Plassey", "PMBAKVL_SHANDY", "Podanur Junction", "Pokhrayan", "Pokran", "Pollachi Junction", "Polur", "Ponmalai Golden Rock", "Ponneri", "Porbandar", "Potul", "Prabhadevi", "Prachi Road Junction", "Pranpur Road", "Prantij", "Prantik", "Prayag", "Prayag Ghat", "Pritam Nagar", "Proddatur", "Puducherry", "Pudukad", "Pudukkottai", "Pugalur", "Pulgaon Junction", "Punalur", "Punarakh", "Pundhag", "Pune Junction", "Punkunnam", "Punpun", "Puntamba", "Purab Sarai", "Puraini", "Puranigudam", "Puranpur", "Puri", "Purna Junction", "Purnia Junction", "Purnia Court", "Purua Khera", "Purulia Junction", "Puttur", " QUARRY SDG", "Rabale", "Radhanpur", "Radhikapur", "Rae Bareli Junction", "Rafiganj", "Ragaul", "Raghunathpur", "Raha", "Rahimabad, India", "Rahimatpur", "Rahul Road", "Rahuri", "Rai Singh Nagar", "Raibha", "Raichur", "Raiganj", "Raigarh", "Raika Bagh", "Raila Road", "Raimehatpur", "Raipur Junction", "Rairakhol", "Raisi", "Raiwala", "Raj Gangpur", "Raj Nandgaon", "Raja Bhat Khawa", "Raja Ka Sahaspur", "Raja Ki Mandi", "Rajaldesar", "Rajamundry", "Rajapalayam", "Rajapur Road", "Rajawari", "Rajendranagar Terminal", "Rajgarh", "Rajghat Narora", "Rajgir", "Rajhura", "Rajiyasar", "Rajkharsawan Junction", "Rajkot Junction", "Rajlu Garhi", "Rajmahal", "Rajmane", "Rajosi", "Rajpipla", "Rajpura Junction", "Rajula City", "Rajula Junction", "Rajur", "Rakha Mines", "Rakhi", "Ram Chaura Road", "Raman", "Ram Dayalu Nagar", "Ramanagaram", "Ramanathapuram", "Ramdevra", "Rameswaram", "Ramganga", "Ramganj", "Ramganj Mandi", "Ramgarh Cantonment", "Ramgarhwa", "Ramagundam", "Ramkola", "Ram Mandir", "Ramna", "Ramnagar", "Rampur", "Rampur Dumra", "Rampur Hat", "Rampura Phul", "Ramsan", "Ramsar", "Ramtek", "Rana Bordi", "Ranaghat Junction", "Ranala", "Ranapratapnagar", "Ranavav", "Marwar Ranawas", "Ranchi", "Ranchi Road", "Rangapara North", "Rangiya Junction", "Rangjuli", "Rangmahal", "Rani", "Ranibennur", "Raniganj", "Ranipur Road", "Raniwara", "Ranjangaon Rd", "Ranjani", "Ranoli", "Ranolishishu", "Ranpur", "Ranthambhore", "Ranuj", "Rasra", "Rasulabad", "Rasull", "Rasuriya", "Rasipuram", "Ratabari", "Ratan Shahr", "Ratangaon", "Ratangarh Junction", "Ratangarh West", "Ratanpura", "Rathdhana", "Ratlam Junction", "Ratnagiri", "Ratnal", "Rau", "Rauzagaon", "Raver", "Rawania Dungar", "Rawatpur(Kanpur)", "Raxaul Junction", "Rayagada", "Rayalcheruvu", "Raybag", "Rayadurg", "Razampeta", "Reay Road", "Rechni Road", "Ren", "Renigunta Junction", "Renukut", "Renwal", "Reoti B Khera", "Repalle", "Rethorakalan", "Rewa Terminal", "Rewari Junction", "Richha Road", "Richughutu", "Ridhore", "Ringas Junction", "Risama", "Rishikesh", "Rishra", "Risia", "Rithi", "Rajendar Nagar Bihar", "Ramgarh Shekhwati", "Raninagar Jalpaiguri", "Robertsganj", "Roha", "Rohana Kalan", "Rohini", "Rohtak Junction", "Roorkee", "Rora", "Roshanpur", "Rotegaon", "Rourkela", "Rowta Bagan", "Roza Junction", "Rudauli", "Rudrapur City", "Rudrapur Road", "Rukadi", "Runija", "Runkhera", "Rupaheli", "Rupahigaon", "Rupamau", "Rupaund", "Rupasibari", "Rupbas", "Rupnagar", "Rupnarayanpur", "Rupra Road", "Rupsa Junction", "Rura", "Rusera Ghat", "Ruthiyai Junction", "Swami Narayan Chhapia", "Sabalgarh", "Sabarmati Bridge", "Sabarmati Junction (Metre Gauge)", "Sabarmati Junction", "Sabarmati South", "Sabaur", "Sabroom", "Sachin", "Sadar Bazar", "Sadat", "Sadhoo Garh", "Sadisopur", "Sadulpur Junction", "Sadulshahr", "Safdarjung", "Safedabad", "Sagardighi", "Sagar Jambagaru", "Sagarpali", "Sagauli Junction", "Sagoni", "Saharanpur Junction", "Saharsa Junction", "Sahatwar", "Sahawar Town", "Sahibabad Junction", "Sahibganj Junction", "Sahibpur KML Junction", "Sahjanwa", "Sri Sathya Sai Prasanthi Nilayam", "Saidkhanpur", "Saidraja", "Sainthia railway station", "Saiyid Sarawan", "Sajanvar Road", "Sajiyavadar", "Sakaldiha", "Sakharayapatna (Sakrepatna)", "Sakhi Gopal", "Sakhoti Tanda", "Sakhpur", "Sakleshpur", "Sakri Junction", "Saktesgarh", "Sakti", "Salakati", "Salamatpur", "Salar", "Salarpur", "Salawas", "Salchapra", "Salekasa", "Salem Junction", "Salem Market", "Salem Town", "Salemgarhmasani", "Salempur Junction", "Salogra", "Salona", "Salpura", "Salur", "Salwa", "Samaguri", "Samakhiali", "Samakhiali B G", "Samalkha", "Samalpatti", "Samalkot Junction", "Samastipur Junction", "Samba", "Sambalpur", "Sambalpur Road", "Sambhar Lake", "Samdhari Junction", "Samlaya Junction", "Sampla", "Samrau", "Samsi", "Sanehwal", "Sanand", "Sanaura", "Sanawad", "Sanchi", "Sandal Kalan", "Sandila", "Sanathnagar", "Sandhurst Road", "Saneh Road", "Sanganapur", "Sanganer", "Sangar", "Sangaria", "Sangat", "Sangli", "Sangmeshwar Road", "Sangola", "Sangrampur", "Sangrana Sahib", "Sangrur", "Sanichara", "Sanjan", "Sankarankovil", "SankariDurg", "Sankval", "Sanosara Nandra", "Sanosra", "Sanpada", "Sant Road", "Santacruz", "Santaldih", "Santalpur", "Santir Bazar", "Sanvordam Curchorem", "Sanvatsar", "Sanvrad", "Sapatgram", "Saphale", "Saradhna", "Sarai Chandi", "Sarai Harkhu", "Sarai Kansrai", "Sarai Mir", "Sarai Rani", "Sarangpur", "Sardarnagar", "Sardarshahr", "Sareigram", "Sareri", "Sarkoni", "Sarnath", "Sarojini Nagar", "Sarola", "Sarotra Road", "Sarsawa", "Sarupathar", "Sarwari", "Sasan Gir", "Sasaram", "Sasni", "Satadhar", "Satara", "Sathajagat", "Sathiaon", "Sathin Road", "Satna", "Satnali", "Satuna", "Satur", "Saugor", "Savarda", "Savarkundla", "Savda", "Sawai Madhopur", "Sawai Madhopur Junction", "Sawantwadi Road", "Sealdah", "Seawoods-Darave", "Secunderabad Junction", "Sehore", "Sehramau", "Selu", "Semarkheri", "Senapura", "Senchoa Junction", "Sendra", "Sengottai", "Seohara", "Seoraphuli", "Seram", "Serampore", "Settihally", "Sevagram", "Sevaliya", "Sewapuri", "Sewri", "Shadhoragaon", "Shahabad", "Shahad", "Saharsa Junction", "Shahbad Markanda", "Shahbad Mohammadpur", "Shahdol", "Shahganj Junction", "Shahjehanpur", "Shahpur Patoree", "Shahzad Nagar", "Shajahanpur court", "Shajapur", "Shakti Nagar", "Shakurbasti", "Shambhupura", "Shamgarh", "Shamlaji Road", "Shankargarh", "Shankarpalli", "Shantipur", "Shapur Sorath Junction", "Sharma", "SHDSPRA_PADMPRA", "Shedbal", "Shegaon", "Sheikpura", "Shelu", "Shendri", "Shenoli", "Sheo Singh Pura", "Sheopur Kalan", "Sherekan", "Shertalai", "Shikohabad Junction", "Shimla", "Shimoga", "Shimoga Town", "Shirdi (Sainagar Shirdi)", "Shiribagilu", "Shiroor", "Shirravde", "Shirsoli", "Shiupur", "Shivamogga", "Shivarampur", "Shivnagar", "Shivni Shivapur", "Shivpuri", "Shivrampur", "Shivaji Bridge", "Shoghi", "Shohratgarh", "Sholapur CB", "Sholavandan", "Shoranur Junction", "Shri Amirgadh", "Shri Ganganagar", "Shri Karanpur", "Shri Madhopur", "Shri Mahabirji", "Shri Mata Vaishno Devi Katra", "Shridham", "Shrigonda Road", "Shrikalyanpura", "ShriKshetra Nagzari", "Shrirajnagar", "Shrirangapatna", "Shrivagilu", "Shujaatpur", "Shujalpur", "Shyamnagar", "Siajuli", "Sibsagar Town (Sivasagar)", "Siddhpur", "Sidhauli", "Sidmukh", "Sihapar", "Siho", "Sihor Gujarat", "Sihora Road", "Sikandarpur", "Sikandra Rao", "Sikar Junction", "Sikir", "Silanibari", "Silao", "Silapathar", "Silaut", "Silchar", "Siliguri Junction", "Siliguru Town", "Silli", "Simaluguri Junction", "Simaria", "Simbhooli", "Simen Chapari", "Simhachalam", "Simlagarh", "Simultala", "Simurali", "Sindhudurg", "Sindi", "Sindkheda", "Sindpan", "Sindri Town", "Sindurwa", "Singanallur(Coimbatore)", "Singapur Road", "Singarayakonda", "Singareni Colleries", "Singarpur", "Singrauli", "Singwal", "Sini Junction", "Sion", "Siras", "Sirathu", "Sirhind Junction", "Sirkazhi", "Sirli", "Sirohi Road", "Sirpur Kagaznagar", "Sirpur Town", "Sirran", "Sirsa", "Sisarka", "Sisvinhalli", "Siswa Bazar", "Sitamarhi", "Sitapur", "Sitapur Cantonment", "Sitapur City", "Sitarampur", "Sithalavai", "Sithouli", "Sitimani", "Sivaganga", "Sivajinagar", "Sivakasi", "Siwaith", "Siwan Junction", "Siwani", "Sodepur", "Sohagpur", "Sohwal", "Sojat Road", "Sojitra", "Solan", "Solan Brewery", "Solapur Junction", "Solapur Junction", "Somanur", "Somesar", "Somna", "Somnath", "Sompeta", "Son Nagar", "Sonagir", "Sonarpur Junction", "Sondha Road", "Sonegaon", "Songadh", "Soni", "Sonik", "Sonipat", "Sonpur Junction", "Sonwara", "Sorbhog Junction", "Sorupeta", "Soro", "Soron", "Sri Dungargarh", "Sri Kalahasti", "Srikakulam Road", "Srikrishna Nagar", "Sriramnagar", "Srirampur, Assam", "Srirangam", "Srivilliputtur", "Subansiri", "Subedarganj", "Subrahmanya Road", "Subzi Mandi", "Suchipind", "Sudsar", "Sujangarh", "Sujanpur", "Sukhisewaniyan", "Sukhpar Roha", "Sukhpur", "Sukritipur", "Suladhal", "Sulah Himachal Pradesh", "Sulgare", "Sullurupeta", "Sultanganj", "Sultanpur", "Sultanpur Lodi", "Sulur Road (Coimbatore)", "Sumer", "Summadevi", "Summer Hill", "Sumreri", "Sunam", "SundaraperumalKoil", "Sunderabad", "Sundlak", "Supaul", "Suraimanpur", "Surajgarh", "Surajpur", "Surajpur Road", "Surat", "Suratgarh Junction", "Surathkal", "Suravali", "Sureli", "Surendranagar", "Suriawan", "Surla Road", "Surpura", "Suwansa", "Suwasra", "Swamimalai", "Swarupganj", "Tadali", "Tadepalligudem", "Tadipatri", "Tadwal", "Tahsil Bhadra", "Tahsil Fatehpur", "Tajpur", "Tajpur Dehma", "Tamluk", "Tamuriya", "Takal", "Takari", "Takarkhede", "Takia", "Taksal", "Taku", "Talaiyuthu", "Talara", "Talakhajuri", "Talala Junction", "Talvadiya Junction", "Talbahat", "Talcher", "Talchhapar", "Talegaon Dabhade", "Talguppa", "Talheri Buzurg", "Talli Saidasahu", "Talod", "Taloja", "Talwandi", "Tambaram", "Tamkuhi Road", "Tanakpur", "Tanda Urmar", "Tandur", "Tangla", "Tangra", "Tankuppa", "Tanuku", "Tanur", "Tapa", "Tapri", "Tarabari", "Taradevi", "Tarak Nagar", "Tarana Road", "Taranga Hill", "Taraori", "Taregna", "Targaon", "Tarighat", "Tarlupadu", "Tarn Taran", "Tarsai", "Tarsari Muria", "Tatanagar Junction", "Tatibahar", "Tatisilwai", "Teghra", "Teharka", "Telam", "Tellicherry", "Tenali Junction", "Theni", "Tenkasi", "Tenmalai", "Tetelia", "Tetulmari", "Tezpore", "Thakurkuchi", "Thakurli", "Than Junction", "Thana Bihpur Junction", "Thandla Rd", "Thane", "Thanjavur Junction", "Thathana Mithri", "Thawe Junction", "Thekeraguri", "Therubali", "Thrissur", "Trivandrum Central", "Thirumullaivoyal", "Thiruninravur", "Thiruvananthapuram Pettah", "Thiruvarur Junction", "Tiruvallur", "Thivim", "Thokur", "Thuria, India", "Tibi", "Tihu", "Tikaria", "Tikekarwadi", "Tikunia", "Tilak Bridge", "Tilak Nagar", "Tilaru", "Tilaiya", "Tilda", "Tilhar", "Tilrath", "Tilwara", "Timarni", "Timba Road", "Timmapur", "Tinai Ghat", "Tindivanam", "Tinpahar Junction", "Tinsukia Junction", "Tipkai", "Tipling", "Tiptur", "Tiruchirapalli Fort", "Tirodi", "Tirora", "Tiruchirapalli Junction", "Tiruchendur", "Tiruchirapalli Palakkarai", "Tirukoilur", "Tirumangalam", "Tirunagesvaram", "Tirunelveli Junction", "Tirupadripuliyur", "Tirupati", "Tirupattur Junction", "Tiruppappuliyur", "Tiruppur", "Tirur", "Tiruttani", "Tiruttangal", "Tiruturaipundi Junction", "Tiruvalla", "Tiruvannamalai railway station", "Tiruverumbur", "Tiruvidaimarudur", "Tiruvottiyur", "Tisi", "Tisua", "Titabar", "Titagarh", "Titlagarh Junction", "Titwala", "Tivari", "Todarpur", "Tohana", "Toranagallu", "Tori", "Trichur", "Trikarpur", "Trilochan Mahdo", "Tripunittura", "Tondiarpet", "Tsunduru", "Tughlakabad", "Tukaithad", "Tulsipur", "Tulwara Jhil", "Tumkur", "Tumsar Road", "Tundla Junction", "Tuni", "Turbhe", "Turtipar", "Tuti Melur", "Tuticorin", "Tuwa", "Twining Ganj", "Tyada", "Ubarni", "Uchana", "Uchippuli", "Udagamandalam", "Udaipur City", "Udaipur Khurd Halt", "Udaipur Tripura", "Udaipura", "Udairampur", "Udalguri", "Udalkachar", "Udasar", "Udgir", "Udhampur", "Udhna Junction", "Udramsar", "Udupi", "Udvada", "Udwantnagar Halt", "Udyankheri", "Ugaon", "Ugar Khurd", "Ugarpur", "Ugna Halt", "Ugrasenpur", "Ugu", "Ugwe", "Ujalvav", "Ujhani", "Ujiarpur", "Ujjain Junction", "Ukai Songadh", "Ukhali", "Ukhra", "Ukilerhat Halt", "Uklana", "Ukshi", "Ulavapadu", "Ulhasnagar", "Ulindakonda", "Ullal", "Ulnabhari", "Ulubaria", "Ulundurpet", "Umar Tali", "Umardashi", "Umaria", "Umariaispah Halt", "Umarpada", "Umbargam Road", "Umda Nagar", "Umed", "Umeshnagar", "Umra", "Umranala", "Umram", "Umred", "Umreth", "Umri", "Umroli", "Una", "Una Himachal", "Unai Vansada Rd", "Unaula", "Unchahar Junction", "Unchaulia", "Unchdih", "Unchhera", "Unchi Bassi", "Undasa Madhawpu", "Undi", "Unguturu", "Unhel", "Unjalur", "Unjha", "Unkal", "Unnao Junction", "Untare Road", "Uplai", "Upleta", "Uppal", "Uppala", "Uppalavai", "Uppalur", "Uppuguda", "Uppugunduru", "Urappakkam", "Urdauli", "Uren", "Urga", "Urkura", "Urlam", "Urma", "Uruli", "Usalapur", "Usia Khas", "Uska Bazar", "Usmanpur", "Usra", "Utarlai", "Utarsanda", "Utrahtia", "Utran", "Utripura", "Uttamarkovil", "Uttangal Mangalam", "Uttar Radhanagar Halt", "Uttarpara", "Uttukuli", "Udumalpettai", "V.O.C Nagar", "Vachaspati Nagar", "Vadaj", "Vadakara", "Vadal", "Vadali", "Vadali Luter Road", "Vadalur", "Vadamadura", "Vadanam Kurussi Halt", "Vadgaon", "Vadgaon Nila", "Vadhvana", "Vadippatti", "Vadiya Devli", "Vadlamannadu", "Vadnagar", "Vadod", "Vadodara Junction", "Vadtal Swaminarayan", "Vadviyala", "Vagdiya", "Vaghli", "Vaibhavwadi Road", "Vaikom Road", "Vailapuzha", "Vaitarna", "Vaitheeswaran Koil", "Vakav", "Valadar", "Valadi", "Valantaravai", "Valapattanam", "Valappadi G Halt", "Valaramanikkam", "Valathoor", "Valavanur", "Valha", "Valivade", "Vallabhnagar", "Vallabh Vidyanagar", "Vallampadugai", "Vallathol Nagar", "Vallikkunnu", "Valliveedu", "Valliyur", "Valmikinagar Road", "Valsad", "Valyampatti", "Vambori", "Vandalu", "Vangani", "Vanganur", "Vangaon", "Vangal", "Vani Road", "Vanigonda", "Vaniyambadi", "Vaniyambadi", "Vaniyambalam", "Vanji Maniyachi Junction", "Vankal", "Vapi", "Varahi", "Varakalpattu", "Varanasi City", "Varanasi Junction", "Varangaon", "Varediya", "Varkala Sivagiri", "Varkhedi", "Varnama", "Vartej", "Varvala", "Vasad Junction", "Vasai Road", "Vasan Iyawa", "Vasco da Gama", "Vashi", "Vasind", "Vaso", "Vastrapur", "Vatluru", "Vatva", "Vavdi", "Vavdi Khurd", "Vavera", "Vayalar", "Vayalpad", "Vazeerpur Halt", "Vedayapalem", "Vedchha", "Veer", "Vejalka", "Vejendla", "Velachery", "Velaccha", "Veldurti", "Vellanur", "Vellarakkad", "Vellayil", "Vellipalayem", "Velliyani", "Vellodu", "Vellore Cantonment", "Vellore Town", "Vellur Halt", "Velpuru", "Velpuru Road", "Vemuru", "Vendodu", "Vendra", "Venkatachalam", "Venkatagiri", "Venkatagiri Kote Halt", "Venkatampalli", "Venkatanarashimarajuvaripeta", "Venkatnagar", "Ventraptagada", "Vepagunta", "Veppampattu", "Veraval", "Verka Junction", "Verna", "Vetapalemu", "Vidisha", "Vidhraswattha", "Vidya Nagar", "Vidyapatinagar", "Vidyasagar", "Vidyavihar", "Vijapur", "Vijayamangalam", "Vijianagar", "Vijayawada Junction", "Vijaypur Jammu", "Vijpadi Road", "Vikarabad Junction", "Vikhran", "Vikhroli", "Vikramgarh Alot", "Vikramnagar", "Vikravandi", "Vilad", "Vilavade", "Vialayatkalan Road", "Ville Parle", "Vilegaon", "Villianur", "Villivakkam", "Villiyambakkam", "Villupuram Junction", "Vindhyachal", "Vinhere", "Vinnamangalam", "Vinukonda", "Viramdad", "Viramgam Junction", "Virani Alur", "Virapandy Road", "Viraput", "Virar", "Virarakkiyam", "Viravada", "Viravalli", "Viravasaram", "Virbhadra", "Virichipuram", "Virochannagar", "Virol", "Virpur", "Virudunagar Junction", "Virul", "Visakhapatnam", "Visapur", "Visavadar", "Vishnupuram", "Vishrambag", "Vishvamitri", "Visnagar", "Viswanath Chrli", "Vithalwadi", "Viveka Vihar", "Vivekanandpuri Halt", "Vizianagaram Junction", "V. O. C. Nagar railway station", "Vondh", "Vriddhachalam Junction", "Vrindhachalam Town", "Vrindaban Road", "Vyara", "Vyasarpadi Jeeva", "Vyasnagar", "Wadakanchery", "Wadala Road", "Wadegaon", "Wadhwan City", "Wadi Junction", "Wadiaram", "Wadrengdisa", "Wadsa", "Wadsinge", "Wadwal Nagnath", "Waghai", "Waghoda", "Wair", "Walajabad", "Walajah Road", "Walayar", "Wan Road", "Wandal", "Wanderjatana", "Wanegaon", "Wangapalli", "Wani", "Wankaner City", "Wankaner Junction", "Wanparti Road", "Wansjaliya", "Warangal", "Wardha East", "Wardha Junction", "Waria", "Warigaon Newada", "Waris Aleganj", "Warora", "Warud", "Warudkhed", "Wasanapura", "Washermanpet", "Washim", "Washimbe", "Wasud", "Wathar", "Wazerganj", "[[(Wellington) railway station|]]", "Wena", "West Hill", "West Mambalam", "Whitefield", "Wihirgaon", "Wimco Nagar", "Wirur", "WRS Colony PH", "Wyndhamganj", "Yadalapur", "Yadgir", "Yadudih", "Yadvendranagar", "Yakutpura", "Yalvigi", "Yamuna Bridge", "Yamuna South Bank", "Template:RwsYaqutganj", "Yataluru", "Yavatmal", "Yedamangala", "Yedapalli", "Yedakumeri", "Yedshi", "Yelahanka Junction", "Yelgur", "Yeliyur", "Yellakaru", "Yeola", "Yermaras", "Template:RwslYerpedu", "Yerra Goppa Halt", "Yerraguntla Junction", "Yesvantapur Junction", "Yeulkhed", "Yevat", "Yogendra Dham Halt", "Yusufpur", "Zafarabad Junction", "Zahirabad", "Zamania", "Zampini", "Zantalapalle", "Zankhvav", "Zarap", "Zarpur Pali", "Zawar", "Zindpura" ];
    var codes=["ABB", "AHA", "AYU", "ABS", "ABR", "ABW", "ACK", "ACND", "ACH", "ELP", "ULD", "AH", "AHO", "ANDI", "ADD", "AAR", "ABZ", "ADB", "AI", "ADTP", "AD", "ADRA", "ADT", "AGTL", "AGAS", "AGD", "AWP", "AGMN", "AGY", "AGC", "AGA", "AF", "AHLR", "AHH", "ANG", "AMP", "ADI", "ARW", "AIRL", "ASH", "AIT", "ATMO", "AJR", "ANI", "AIA", "AJ", "AJH", "AJIT", "AII", "AJNI", "AKOR", "AKT", "AKE", "AKJ", "ABP", "AKVD", "AKD", "AK", "AKR", "AKW", "AKOT", "AKRD", "AMG", "ALER", "ALGP", "AIG", "ALB", "ALJN", "APD", "APDJ", "ALY", "ALD", "ALLP", "LMT", "LWR", "ALNI", "AUB", "AWR", "AWY", "AN", "AML", "AMW", "APA", "AMS", "AADR", "AGB", "UMB", "UBC", "AMPA", "ABLE", "ABX", "ABFC", "ABH", "ABSA", "ASD", "ABU", "ABI", "AAP", "ABKA", "ABKP", "ABE", "ABY", "ABD", "UMN", "AMB", "AB", "AME", "AGN", "AGI", "AMLA", "AAL", "AMX", "AMLI", "AMSA", "AONI", "AMI", "AE", "ASR", "AVL", "AMRO", "AKP", "ANND", "ANDN", "ANVT", "ANSB", "ANP", "ATP", "APT", "ANR", "ANAS", "UDL", "ADH", "AAM", "AFK", "AAG", "ANGL", "APU", "ANJ", "ANO", "AJE", "AJI", "ANK", "AKV", "ANKL", "ANNR", "ANV", "NGR", "ANPR", "ATH", "ANTU", "AUBR", "APH", "APR", "AUS", "AO", "ARA", "ABGT", "AJJ", "ARK", "AAY", "ARR", "ARQ", "ARS", "AVRD", "ARCL", "AVK", "ALU", "AOR", "AS", "ARE", "ARV", "ASK", "APK", "ARVI", "AYV", "AFR", "JOB", "ASO", "ASN", "AST", "ASKN", "ABO", "ANA", "ASL", "AT", "AXK", "AAS", "ATT", "AA", "ATE", "AEL", "ATG", "AIP", "AIPP", "ARP", "AUR", "ATRU", "ATS", "ATR", "ATTR", "AJRE", "AED", "ARJ", "AWB", "AVS", "AUWA", "AVD", "AY", "AMH", "AZR", "AZA", "ACLE", "AZ", "BBDE", "BTP", "BEE", "BV", "BAB", "BBA", "BBO", "BUPH", "BCHL", "bgl", "BCA", "BUDM", "BAD", "BDM", "BMPR", "BPY", "BPG", "BPB", "train", "BDGM", "BDHA", "BDHL", "BUD", "BHD", "BDU", "BD", "BNZ", "BSE", "BWS", "BUG", "BGK", "BGBR", "BF", "BSRX", "BGH", "BJQ", "BGTA", "BQN", "BGX", "BWB", "BSS", "BGZ", "BPD", "BHI", "BIP", "BHAW", "BJ", "BRK", "BDME", "BIZ", "BGUA", "BYP", "BRH", "BOI", "BHRB", "BIP", "BGU", "BALR", "BJW", "BKP", "BK", "BTC", "BLM", "BLGR", "BLS", "BLDK", "BLWL", "BLW", "BPQ", "BAE", "BKS", "BVU", "BVH", "BLLI", "BUI", "BAPR", "BLY", "BLN", "BLP", "BLSD", "BALU", "WAB", "BAWA", "BMG", "BMHR", "BMW", "BMLL", "BMI", "BMSN", "BMB", "BMSN", "BGMN", "BYN", "BPF", "BNO", "BNQ", "BNS", "BAND", "BSN", "BNSA", "BNDA", "BNU", "BDW", "BXK", "BDC", "BR", "BKI", "BA", "BDTS", "BNC", "SBC", "BNCE", "BWT", "BWY", "BOD", "BANI", "BSDA", "BTK", "BQA", "BQK", "BNKI", "BAO", "BCD", "BSBR", "BIQ", "BSQP", "BNLW", "BGG", "BNTL", "BTRA", "BWC", "BOTI", "BPP", "BAR", "BJMD", "BBK", "BBM", "BBN", "BUA", "BNM", "BRHU", "BRGM", "BRR", "BARL", "BRMT", "BAZ", "BARN", "RAA", "BT", "BJU", "BBTR", "BCRD", "BWN", "BIY", "BE", "BRY", "BRYC", "BJD", "BRZ", "BET", "BRGA", "BRGW", "BARH", "BRN", "BHW", "BRYA", "BNY", "BBMN", "BUP", "BRKA", "BKJ", "BLAX", "BME", "BNG", "BNN", "BOF", "BRPL", "BPRD", "BP", "BSY", "BSQ", "BTW", "BOE", "BZO", "BXF", "BTRA", "BAV", "BRP", "BWR", "BRWD", "BWW", "BYHA", "BZY", "BSX", "BSI", "BTG", "BSKR", "BBQ", "BMF", "BANE", "BSPN", "BTS", "BST", "BSGN", "BU", "BTDR", "BAT", "BVA", "VLA", "BWL", "BWK", "BXN", "BUT", "BZJT", "BPZ", "BZGT", "BEAS", "BER", "", "BVV", "BMT", "BGS", "BEG", "", "BJN", "BTX", "BPA", "BAP", "BIG", "BEL", "BGM", "BYL", "BAY", "BYC", "BPH", "BXM", "BLRE", "BLTR", "BEQ", "BWD", "BEHR", "BCH", "BPC", "BAM", "BSRL", "BEW", "BTH", "BZU", "BAH", "BBU", "BCO", "BCOB", "BDN", "BWH", "BVB", "BDI", "BOY", "BHD", "BDCR", "BHC", "", "BDVT", "BBY", "VAA", "BGP", "BGKT", "BAGA", "BGTN", "BNR", "BGPR", "BZK", "BOG", "BKNG", "BHLK", "BLMK", "BNP", "BUX", "BRD", "BND", "BXG", "BKD", "BTKP", "BTKD", "BTE", "BWRA", "BNT", "BH", "BSZ", "BRE", "BHTL", "BOV", "BTI", "BHV", "BTJL", "BTT", "BHG", "BHTR", "BTPR", "BHT", "BNVD", "BVP", "BVNR", "BVC", "BWM", "BWIP", "BWP", "BYR", "BHY", "BIPR", "BEP", "BSWD", "BRGT", "BFY", "BGVN", "BLD", "BPHB", "BQR", "BVQ", "BLDI", "BHL", "BIML", "BMN", "BMQ", "BMSR", "BVRM", "BVRT", "BNH", "BZM", "BIX", "BWA", "BTO", "", "BIRD", "BNW", "BNWC", "BDMJ", "BPRS", "BPR", "BOJ", "BHAS", "BJE", "BOKE", "BHNE", "BGQ", "BG", "BIH", "DWN", "HBJ", "BPL", "BMND", "BMSD", "BNTP", "BBS", "BHUJ", "BSJ", "VPO", "BSL", "BUBR", "BSL", "BN", "BIC", "BCP", "BID", "BDNP", "BIDR", "BNXR", "BIU", "BDYR", "BQP", "BHZ", "BEHS", "BEA", "BTA", "BJNR", "BJP", "BJI", "VST", "BJF", "BJO", "BIJR", "BJK", "BJA", "BJRI", "BKN", "BMR", "BSP", "BLOR", "BILD", "BLG", "BLU", "BIM", "BILK", "BXLL", "BLPU", "BWI", "BINA", "BNAR", "BKO", "BNV", "BIR", "BDWL", "BAMA", "BMK", "BRPT", "BLNR", "BRMP", "BEO", "BRLY", "BRS", "RRB", "BIWK", "BISH", "BTJ", "VSU", "BSPR", "BMCK", "BUB", "BIS", "BVN", "BVR", "BRRG", "BOBS", "VBL", "BDE", "BDHN", "BDWD", "BONA", "BOR", "BXJ", "BKSC", "BKRO", "BOKO", "BLX", "BMO", "BLC", "BHP", "BQI", "BNGN", "BOW", "BXY", "BIO", "BRRD", "BGN", "BVI", "BGHU", "BRVR", "BTD", "BXHT", "BRT", "BRJN", "BRLA", "BAL", "BEM", "BDHY", "BLZ", "BNI", "BSC", "BUDI", "BEK", "", "BAU", "BUH", "BUW", "BURN", "BTR", "BWF", "BXR", "BDRL", "BY", "BRND", "BBT", "", "BNJ", "BBDB", "BGB", "BMG", "BIRA", "BNAA", "BEQ", "BEQM", "BRPK", "BBR", "BZR", "BIJ", "KOP", "CLT", "CNO", "CAN", "CS", "CSM", "CRLM", "CLR", "BR", "", "CHB", "CBK", "CDQ", "CBSA", "CW", "CJW", "CJL", "CDH", "CKDL", "CHK", "CAA", "CKP", "CAJ", "CKS", "CKU", "CKI", "CLC", "CSN", "CLK", "CHM", "CMX", "CMNR", "CPH", "CPN", "CHRU", "CPS", "CAF", "CGR", "CNR", "CNBI", "CDMR", "CH", "CNL", "CNA", "CNDM", "CHD", "CDG", "CNI", "CPE", "CDS", "CHBN", "CLDY", "CNK", "CNE", "CD", "CRP", "CDSL", "CND", "CHTI", "CGY", "CGS", "CHNN", "CPT", "CAI", "CPK", "CPQ", "CRW", "LKO", "CBT", "CBG", "CGX", "CRC", "CKD", "CYR", "CHV", "CHJ", "CMU", "CBH", "CHH", "CNH", "CRKR", "CHBR", "CC", "CSA", "CROA", "CKB", "CHLK", "CHA", "CGON", "CMC", "CMBR", "CGL", "CNGR", "MSB", "MAS", "MS", "MSF", "MPK", "CYN", "SRTL", "CTQ", "CTND", "CAG", "CDRL", "CASA", "CHP", "CPR", "CI", "CE", "CSTM", "MCSC", "CAP", "CGO", "CHN", "CWA", "CPDR", "CTE", "COD", "COO", "CNF", "CDM", "CEU", "CBP", "CMGR", "CTH", "JRU", "CKNI", "CKR", "CIL", "CLKA", "CLO", "CNC", "CPD", "CHG", "CCH", "CJM", "CHSM", "CMY", "CHI", "CPP", "CHII", "CLX", "CRWA", "CRY", "CGN", "CHRM", "CBN", "CTHR", "CTL", "CIT", "CTA", "CKTD", "CTTP", "CTT", "CTRD", "COE", "CT", "CRJ", "COR", "CTO", "CDL", "CKE", "CHL", "CGH", "COM", "CWI", "CPU", "CRL", "CVR", "CSL", "CTKT", "CNS", "CDA", "CHF", "CAR", "CCG", "CUK", "CUR", "CBJ", "CHTS", "CBE", "CBF", "CLJ", "CNT", "ONR", "CTGN", "COT", "CUPJ", "HX", "CBM", "CTC", "CRD", "DBR", "DB", "DBV", "DBLA", "DBI", "DBM", "DBA", "DUB", "DDR", "DR", "DER", "DGX", "DAP", "DRD", "DKBJ", "DZB", "DIC", "DHD", "DWA", "DKNT", "DAKE", "DK", "DL", "DLD", "DLQ", "DLO", "DAL", "DALR", "DLK", "DRZ", "DMW", "DLC", "DLP", "DSS", "DTO", "DMNJ", "DCA", "DME", "DMO", "DNR", "DED", "DND", "DPS", "DTX", "DNWH", "DKDE", "DKAE", "DAR", "DAPD", "DHPR", "DJA", "DARA", "DRGJ", "DBG", "DJ", "DTL", "DYD", "DYP", "DS", "DZA", "DAA", "", "DDP", "DLB", "DD", "", "DOZ", "DRLA", "DMH", "DO", "DSNI", "DVG", "DLPR", "DRB", "DBP", "DNA", "DDN", "DOS", "DEHR", "DKPM", "DLI", "DE", "DAZ", "DEC", "DKZ", "DEE", "DSJ", "DSA", "DVA", "DEMU", "DBD", "DFR", "DGHR", "DELO", "DEOS", "DEP", "DRL", "DES", "DSLP", "DSO", "DSL", "DTJ", "DKO", "DBEC", "DVGM", "DOHM", "DVL", "DPZ", "DEW", "DWG", "DWX", "DABN", "DQL", "DLGN", "DHRY", "DMN", "DNE", "DAM", "DPR", "DTR", "DMU", "DXK", "DKW", "DNK", "DN", "DHVR", "DHN", "DDL", "DNRA", "DCK", "DQN", "DAN", "DNG", "DNM", "DML", "DXG", "DRS", "DARI", "DHW", "DAB", "DMR", "DPJ", "DMM", "DMP", "DHR", "DWR", "DAS", "DHO", "DUA", "DHA", "DKJR", "DMC", "DNKL", "DIW", "DHND", "DNHK", "DDK", "DIU", "DBZ", "DHJ", "DHRR", "DHRJ", "DPP", "DHKR", "DOD", "DOH", "DLJ", "DHMZ", "DOL", "DOK", "DNDI", "DJI", "DHG", "DBB", "DHI", "DGT", "DKT", "DPRA", "DQG", "DUI", "DIB", "DBRG", "DBRT", "DHP", "DIA", "DGU", "DBY", "DGA", "DXD", "DKE", "DIL", "DLN", "DMV", "DM", "DNN", "DIQ", "DG", "DWI", "DIPA", "DPU", "DPLN", "DIP", "DISA", "DTC", "", "DINR", "DWNA", "DWV", "DEOR", "DBHL", "DKRD", "DBU", "DBL", "DIT", "DWO", "", "DI", "DMG", "DKD", "DDE", "DGN", "DGG", "DOG", "DOA", "DVR", "DKJ", "DNC", "DUBH", "DBW", "DXN", "DDS", "DWF", "DUD", "DYK", "DDNI", "DKX", "DUK", "DDY", "DUN", "DGQ", "DIG", "DXH", "DJG", "DLCR", "DLR", "DUS", "DDJ", "DDC", "DY", "DURE", "DMKA", "DMRT", "DOR", "DOB", "DGJ", "DNRP", "DDA", "DGO", "DURG", "DGR", "DTK", "DPA", "DSK", "DVD", "DWK", "DWJ", "EKM", "EKR", "EKC", "EM", "EKMA", "EL", "YLM", "ENB", "EE", "ENR", "ELL", "ERL", "IRP", "ERS", "ERN", "ERG", "ED", "ETAH", "ETW", "ETMD", "ETUE", "ETK", "FD", "FYZ", "FKB", "FKM", "FLK", "FA", "FHT", "FRD", "FDB", "FDN", "FDK", "FBD", "FKD", "FSP", "FTD", "FGR", "FGSB", "FAN", "FTP", "FTS", "FPS", "FUT", "FZL", "FKA", "FK", "FZD", "FZR", "FZP", "FBG", "FKG", "FTG", "", "GCH", "GDG", "GAR", "GKD", "GDD", "GWD", "GMR", "GAW", "GIR", "GAE", "GJL", "GAA", "GRF", "GUR", "GWA", "GNU", "GSX", "GIMB", "GIM", "GG", "GADJ", "GNC", "GAJ", "GANG", "GNH", "GGC", "GRMP", "GGR", "GJUT", "BAQ", "GJMB", "GWM", "GHH", "GRMR", "GMS", "GGB", "GHQ", "GOH", "GHD", "GRX", "GB", "GPF", "GBD", "GNG", "GUP", "GMU", "GWS", "GPX", "GAYA", "GER", "GTKD", "GAD", "GOI", "GHG", "GHGL", "GANL", "", "GRA", "GSO", "GKB", "GTM", "GC", "GPB", "GTS", "GZB", "GCT", "GOE", "GVD", "GDYA", "GRWD", "GPR", "GOPA", "GSD", "GH", "GGS", "GTI", "GOD", "GID", "GDB", "GHR", "GEG", "GRHM", "GRD", "GW", "GLPT", "GDHA", "GDA", "GAMI", "GOM", "GOA", "GHNA", "GPZ", "GKK", "GOK", "GK", "GRE", "GKJ", "GTA", "GOLE", "GOZ", "GTNR", "GMO", "GD", "GDL", "G", "GNA", "GY", "GOP", "GOPG", "GPPR", "GGM", "GKC", "GKY", "GKP", "GGO", "GRH", "GRL", "GRY", "GMN", "GNO", "GVR", "GIO", "GGJ", "GOGH", "GOTN", "GON", "GTE", "GV", "GDO", "GVG", "GND", "GVMR", "GOVR", "GOV", "GOY", "GTR", "GA", "", "GBB", "GDV", "GYM", "GDR", "GJD", "GLG", "GBP", "GLH", "GUB", "GR", "GUH", "GED", "GULR", "GZH", "GUMA", "GMIA", "GMM", "GPD", "GTF", "GUNA", "GDZ", "GVB", "GTL", "GNT", "GPA", "GRRU", "GRAE", "GSP", "GGN", "GUX", "GRI", "GQL", "GMX", "GAP", "GHJ", "GSW", "GUV", "GTBN", "GVR", "GHY", "GWL", "GYN", "HWX", "HBJ", "HBW", "HB", "HDP", "HRM", "HM", "HZR", "HFG", "HYT", "HBN", "HGH", "HKD", "HJP", "HKP", "HLDR", "HLDD", "HDB", "HDW", "HLR", "HVD", "HMR", "HMG", "HAR", "HNK", "HDK", "HNS", "HSWS", "HMH", "HMO", "HWT", "HAPA", "HPRD", "HPU", "HJO", "HGL", "HKH", "HRN", "HAA", "HCP", "HD", "HRI", "HGJ", "HW", "HRR", "HIR", "HAD", "HP", "HPGM", "HCR", "HSK", "HRSN", "HKL", "HMY", "HRT", "HRPG", "HPP", "HRW", "HSI", "HRD", "HRH", "HAA", "HSA", "HAS", "HSP", "HN", "HTZ", "HTGR", "HTC", "HRS", "HTJ", "HRF", "HTE", "HTE", "HTK", "HTD", "HVR", "HZD", "NZM", "HZD", "HK", "HML", "HMP", "HNDR", "HLX", "HIL", "HEM", "HMT", "HAN", "HMZ", "HC", "HMK", "HUP", "HGT", "HNL", "HRNR", "HKG", "HNL", "HRG", "HDA", "HSR", "HSL", "HDL", "HJI", "HOL", "HUK", "HLAR", "HNA", "HGY", "HYG", "HMBD", "HSD", "HBD", "HSX", "HPT", "HSRA", "HG", "HBG", "HWH", "UBL", "HJLI", "HSQ", "HYB", "IB", "unknown", "IGP", "ICL", "IDAR", "IDH", "IGP", "IKK", "IKR", "IHP", "IDL", "INP", "IAA", "IDG", "IDR", "INDB", "INDM", "INJ", "", "ITE", "AAH", "IQG", "IQB", "IJK", "IGU", "ISA", "IPR", "ISM", "ET", "ITA", "ITR", "IZN", "JBP", "JBL", "JBX", "JADR", "JCL", "JUD", "JUDW", "JGD", "JDL", "JSOR", "JTB", "JDB", "JDL", "JGJ", "JID", "JNX", "JGN", "JKH", "JP", "JAIS", "JSM", "JTI", "JTU", "JTW", "JWL", "JJKR", "JHL", "JKB", "JLN", "JKN", "JHA", "JHN", "JKA", "JKS", "JLL", "JPD", "JM", "JRC", "JUC", "JLS", "JER", "JL", "JIL", "JALD", "J", "JOR", "JPG", "JPE", "JAC", "JACN", "JDH", "WTJ", "JMP", "JMV", "JBB", "JMRA", "JMDG", "JMKT", "JAT", "JAM", "JMS", "JMT", "JMU", "JMK", "JVL", "JNR", "JNL", "ZN", "JNH", "JRLE", "JNE", "JKM", "JAO", "JPL", "JSV", "JRJ", "JARI", "", "JLD", "JSA", "JSI", "JSME", "JSR", "JSH", "JGR", "JSKA", "JTRD", "JTG", "JTS", "JUK", "JOP", "JNU", "JVA", "JWO", "JWB", "JAL", "JMKR", "JSP", "JYG", "JNM", "JHD", "JJR", "JNZ", "JEP", "JLR", "JTV", "JTP", "JEUR", "JGE", "JPI", "JGI", "JAJ", "JHW", "JAA", "JJP", "JHS", "JGM", "JRI", "JRQ", "JSG", "JWS", "JHG", "JJK", "JJN", "JUP", "JIA", "JIND", "JIR", "ZRD", "JRBM", "JIGT", "JRO", "JPM", "JU", "JBN", "JOS", "JOM", "JGF", "JPZ", "JDNX", "JGW", "JTJ", "JYK", "JVN", "JT", "JTTN", "JTN", "JOC", "", "JGJN", "", "JKE", "JNA", "JNDC", "JND", "JBG", "JCN", "JNO", "JRX", "JTO", "JWP", "KCG", "KWH", "KN", "KDU", "KDNL", "KRY", "DRU", "KTCH", "COA", "CCT", "KNR", "KQI", "", "KLNK", "KLK", "KKGT", "", "KYN", "KLY", "KAP", "KYND", "KLNP", "KLL", "KYQ", "", "KMC", "KXF", "KMST", "KYQ", "KWM", "KKET", "KNBR", "KKU", "kan", "CJ", "KILE", "KGRA", "KZE", "KNNK", "KXP", "KPTM", "KJMG", "KNKD", "KJN", "CPA", "CNB", "RMX", "CPSM", "GOY", "PNK", "CPB", "CAPE", "KXH", "KRD", "KKDI", "KRJA", "KDHA", "KXJ", "KRMR", "S", "KRMI", "KUN", "KRR", "KPY", "KAWR", "N", "KGQ", "KEI", "KPV", "KTX", "KGM", "KAVM", "KTHU", "KIR", "KLCR", "KTE", "KATL", "KPD", "KEA", "KVZ", "KYJ", "KTGM", "KZK", "KZJ", "", "KLV", "KDKN", "KGI", "KSNG", "KDM", "KDV", "KK", "KRH", "KURJ", "KIP", "KMBL", "KMN", "KMN", "KMT", "KAN", "KAD", "", "KNW", "KNN", "KGP", "", "KE", "", "KHAR", "KAT", "KHTU", "KHED", "KHKN", "KP", "KYE", "KNVT", "KCT", "KOV", "KNHR", "KLQ", "KCE", "KNE", "KIUL", "KCVL", "KQN", "KQR", "KODR", "KMD", "KOU", "KOJ", "KQZ", "CLN", "KOP", "KOL", "KOAA", "QLN", "KOG", "", "KPG", "", "KRPU", "", "KOTR", "KRBA", "KRG", "KOK", "KSB", "KSV", "KSI", "KTW", "KKP", "KOTA", "KTKL", "KTMA", "KSX", "KYOP", "KTV", "KTYM", "KTR", "KQK", "KTY", "CVP", "QLD", "CLT", "", "KCC", "KRNI", "KJM", "KMNC", "KUDL", "KLT", "KLAR", "ULT", "", "KJL", "KMU", "KT", "KUDA", "KPN", "KUM", "KFI", "KCD", "KWV", "CLA", "KRNT", "KKDE", "KTU", "KUR", "KUE", "KIR", "LBN", "LAV", "LAB", "LAC", "LNH", "LMN", "LHN", "LDW", "LAU", "LSI", "LHLL", "LMY", "LKZ", "LKE", "LMP", "LKN", "LNQ", "LTR", "LDY", "LRJ", "LMNR", "LKU", "LLBR", "LP", "LLJ", "LGH", "LGO", "LLI", "LAR", "LKU", "LLR", "LCN", "LPJ", "LRU", "LLU", "LNA", "LBA", "LMA", "LKG", "LDR", "LGT", "LKA", "LPN", "LRD", "LS", "LSR", "LTHR", "LAT", "LUR", "LTRR", "LKQ", "LAUL", "LSG", "LDM", "LHA", "LDA", "LMO", "LM", "LMK", "LCH", "LPI", "LLH", "LDP", "LOHA", "LHU", "LHW", "LNK", "LNO", "LHD", "LSX", "LTT", "LNN", "LNL", "LD", "LONI", "LW", "LFG", "PL", "", "LKR", "LJN", "LKO", "LC", "LDH", "LMG", "LNV", "LUNI", "LNR", "LDU", "LKS", "LUSA", "LSD", "LAL", "LGL", "MCV", "AMIN", "MCVM", "MTM", "MCLA", "MML", "MPL", "MDR", "MAD", "MDVR", "MDKI", "MDU", "MAO", "Madhubani", "MA", "MDBP", "MDHP", "MADP", "MID", "MDR", "MDPB", "MQH", "MBS", "MBI", "MDP", "MDU", "MMK", "MADR", "MHH", "MMH", "MHDP", "MHJ", "MFM", "MX", "MMC", "MWR", "MSMD", "MABD", "MBNR", "MAHE", "MYJ", "MHRG", "MSK", "MSH", "MMD", "MEP", "MM", "MGO", "MMB", "MZN", "MBA", "MAHO", "MHO", "MMLN", "MXY", "MHQ", "MUGA", "MXR", "MHV", "MBG", "MYR", "MINJ", "MLN", "MGX", "MNQ", "MBO", "MW", "MJBT", "MZQ", "MJG", "MJZ", "MJO", "MXH", "MKN", "MKRA", "MKRN", "MKC", "MDD", "MLZ", "MVL", "MLDT", "MET", "MEQ", "MLG", "ML", "MLD", "MLPR", "MLHA", "MALB", "MKU", "MQR", "MLC", "MWX", "MWM", "MY", "MOT", "MLA", "MLSU", "MQS", "MLU", "MLO", "MWH", "MBW", "MOM", "MNSR", "MNM", "MNP", "MPA", "MRE", "MVR", "MCI", "MCS", "MNF", "MGF", "MDL", "MLGH", "MMM", "MC", "MDLE", "MMS", "MDS", "MYD", "MDA", "ADR", "MABA", "MBY", "MNDR", "MDDP", "MFR", "MDB", "MXK", "MUV", "MYA", "M", "MAG", "MLI", "MAQ", "MAJN", "MNI", "MGG", "MGLP", "MAZ", "MHU", "MGI", "MKP", "MAN", "MOAR", "MEJ", "MJS", "MUR", "MNAE", "MNY", "MKB", "MNKD", "MANK", "MMR", "MNUR", "MNJ", "MOU", "MSZ", "", "MNE", "MSP", "MALM", "MUGR", "MVO", "MZGI", "MH", "MJY", "MXA", "MAY", "MXN", "MKM", "MEL", "MIU", "MRK", "MKD", "MRH", "MRL", "MRV", "MPLM", "MBGA", "MBSK", "MBNL", "MBT", "MCPE", "MJ", "KOF", "MWT", "MMY", "MSQ", "MST", "MSD", "MSW", "MSOD", "MHC", "MSR", "MABG", "MTH", "MRT", "MTJ", "MTB", "MTU", "MTNC", "MTN", "MRU", "MEM", "MAU", "MRPR", "MAUR", "MAA", "MVLK", "MVJ", "MYU", "MV", "MYY", "MGME", "MCA", "MED", "MUT", "MTC", "MGN", "MNO", "MAI", "MJA", "MLMR", "MELH", "MNDP", "MYM", "MQX", "MEC", "MTD", "MTE", "MTP", "MTDM", "MWD", "MHD", "MHOW", "MDN", "MGE", "MIN", "MIH", "MIL", "MJR", "MRJ", "MK", "MIRA", "MCQ", "MIQ", "MRTL", "MRZA", "MZL", "MRGA", "MZP", "MSMI", "MFL", "MITA", "MTHP", "MYG", "MYN", "MNKB", "MG", "MDNR", "MLB", "MDPR", "MON", "MOGA", "MQE", "MLJ", "MOG", "MUZ", "MO", "MOY", "MKSR", "MKA", "MXL", "MFC", "MNCR", "MOF", "MGR", "MONJ", "MMC", "MB", "MKX", "MAP", "MVI", "MRDD", "MRA", "MOI", "MRND", "MXO", "MQZ", "MTJR", "MOTH", "MTIA", "MTHH", "MOTC", "BMKI", "MTR", "MTPC", "MOU", "MOO", "MUE", "MFJ", "MGS", "MMA", "MPF", "MEX", "MKT", "MKS", "MCN", "MOL", "MULK", "MLX", "", "MTY", "MLND", "BCT", "", "MBF", "MDLM", "MPH", "MVE", "MNV", "MNGD", "MRB", "MQO", "MUPA", "MUD", "MDRW", "MRDW", "MURI", "MZS", "MRIJ", "MSDR", "MBB", "MZR", "MFKA", "MFB", "MTNL", "MTT", "MOZ", "MFP", "MZM", "MYS", "GZN", "NJM", "NDAE", "NBA", "NDU", "ND", "NAND", "NDKD", "NGL", "NHY", "NGAN", "NGT", "NGE", "NUQ", "NCJ", "NGD", "NAG", "NGI", "NRS", "NRR", "NGO", "NAB", "NAD", "NGK", "NGG", "NGLT", "NCR", "NGP", "NGRT", "NHK", "NHLN", "NHU", "NIG", "NH", "NKI", "NIA", "NYN", "NIR", "NBD", "NRO", "NLD", "NSP", "NLV", "NLDA", "NHT", "NLY", "NLC", "NW", "NMKL", "NBR", "NKM", "NLI", "NAM", "NANA", "NBHM", "NNKR", "NRE", "NDPR", "NED", "NDJ", "NGN", "NAN", "NPKM", "NHM", "NN", "NDB", "NDL", "NLDM", "NNO", "NNN", "NTW", "NNP", "NJN", "NPS", "NTN", "NRK", "NRI", "NNGE", "NRGR", "NS", "NRT", "NRPD", "NNR", "NRPA", "NDN", "NUR", "NROD", "NOI", "NKE", "NRKR", "NNL", "NRD", "NU", "NRW", "NRWI", "NK", "NSD", "NDT", "NTZ", "NNA", "NGW", "NUH", "NWP", "NTV", "", "NUD", "NVU", "NWU", "NLK", "NVS", "NAC", "NWD", "NVG", "NWH", "NVLN", "NDAZ", "NYK", "NNGL", "NYP", "NYO", "NI", "NZT", "NAZJ", "NKD", "NML", "NLR", "NEC", "NEM", "NEP", "NPR", "NPNR", "NRL", "NRG", "NERI", "NU", "NTWL", "NOQ", "NBUJ", "NBVJ", "NBQ", "NCB", "NDLS", "NFK", "NGTG", "NGNT", "NJP", "NMZ", "NMX", "NMM", "NVL", "NYY", "NGJN", "NBP", "NDD", "NMJ", "NDO", "NHN", "NHH", "", "NLBR", "NIL", "NLE", "NLKR", "NMK", "NMH", "NKR", "NBH", "NB", "NILE", "NDH", "NGA", "NPW", "NR", "NIRA", "NKP", "NMA", "NSU", "NEW", "NIV", "NZB", "NIP", "NBX", "NCA", "NOMD", "NHR", "NOK", "NMD", "NNE", "NRLR", "NLP", "NOA", "NRZB", "NOY", "NNW", "NUA", "NRA", "NRM", "OKHA", "DLI", "OMFL", "Om", "ODM", "OGL", "OMT", "ORAI", "OTP", "OGM", "PAI", "PQY", "PCK", "PCH", "PFR", "PC", "PDH", "PDGN", "POU", "PDP", "PDD", "PGA", "PRE", "PRP", "PJA", "PAK", "PKK", "PKR", "PCLI", "PM", "PLMX", "PLMA", "PAE", "PLNI", "PNU", "PLPM", "PSA", "", "PLD", "PHLJ", "PLJ", "PLG", "PGT", "PGTN", "PKO", "PMY", "PLA", "PLK", "PIT", "PXR", "PLSN", "PSO", "PWL", "PBM", "PAN", "PNB", "PCN", "PHRH", "PNVT", "PNGM", "PCT", "PANP", "PDV", "PVR", "PAR", "PMO", "PLM", "PNYA", "PHI", "PNP", "PNT", "PJN", "PNK", "PRT", "PKU", "PBW", "PNVL", "PML", "PDG", "PLH", "PMK", "PS", "PUX", "PNME", "PVU", "PRB", "PBN", "PHQ", "PAD", "PR", "PIH", "PRK", "PLL", "PRLI", "PRU", "PGI", "PRBZ", "PKRA", "PSB", "PRF", "PSD", "PBH", "PRTP", "PTU", "PVP", "PVPT", "PAS", "PTP", "PTN", "PTRE", "PAA", "PTRD", "PTK", "PTKC", "PEH", "PTKD", "PKB", "PHA", "PTLI", "PRI", "PBL", "PTA", "PTLD", "PT", "PNBE", "PNC", "PTH", "PTRU", "PTZ", "PAB", "PRWS", "PRES", "PTB", "PVM", "PAX", "PCM", "PQE", "PDR", "PAZ", "PAY", "PYOL", "PDPL", "PND", "PGG", "PKD", "PER", "PCW", "PEW", "PERN", "PGN", "PTD", "PDKM", "PLI", "PGW", "PKGM", "PLC", "PUD", "PFM", "PHD", "PEP", "PES", "PHR", "FLD", "PUY", "FL", "PLP", "PIJ", "PLMD", "PGK", "PBE", "PDZ", "PKW", "PKE", "PMP", "PDRD", "PLW", "POR", "PLS", "PPR", "PPI", "PPU", "POF", "PPF", "PLE", "PIP", "PPD", "PPG", "PPC", "PIA", "PFL", "PPH", "PJH", "PPT", "PHV", "PRM", "PW", "PMR", "PAP", "PLY", "PBKS", "PTJ", "PHN", "POK", "POY", "PRL", "GOC", "PON", "PBR", "POZ", "EPR", "PCC", "PQD", "PRJ", "PNE", "PRG", "PYG", "PRNG", "PRDT", "PDY", "PUK", "PDKT", "PGR", "PLO", "PUU", "PHK", "PNW", "PUNE", "PNQ", "PPN", "PB", "PBS", "PNI", "PUQ", "PP", "PURI", "PAU", "PRNA", "PRNC", "PRKE", "PRR", "PUT", "QRS", "", "RDHP", "RDP", "RBL", "RFJ", "RGU", "RPR", "RAHA", "RBD", "RMP", "RRE", "RRI", "RSNR", "RAI", "RC", "RGJ", "RIG", "RKB", "RLR", "MTPR", "R", "RAIR", "RSI", "RWL", "GP", "RJN", "RVK", "RJK", "RKM", "RJR", "RJY", "RJPM", "RAJP", "RJI", "RJQ", "RHG", "RG", "RGD", "RHR", "RJS", "RKSN", "RJT", "RUG", "RJL", "RM", "ROS", "RAJ", "RPJ", "RJU", "RLA", "RAJR", "RHE", "RHI", "RMC", "RMN", "RD", "RMGM", "RMD", "RDRA", "RMM", "RGB", "RMGJ", "RMA", "RMT", "RGH", "RDM", "RKL", "RMAR", "RMF", "RMR", "RMU", "RDUM", "RPH", "PUL", "RXN", "RMX", "RTK", "RNBD", "RHA", "RNL", "RPZ", "RWO", "MRWS", "RNC", "RRME", "RPAN", "RNY", "RGJI", "RMH", "RANI", "RNR", "RNG", "RNRD", "RNV", "RNJD", "RNE", "RNO", "RNIS", "RUR", "RNT", "RUJ", "RSR", "RUB", "RES", "RYS", "RASP", "RTBR", "RSH", "RTGN", "RTGH", "RXW", "RTP", "RDDE", "RTM", "RN", "RUT", "RAU", "RZN", "RV", "RWJ", "RPO", "RXL", "RGDA", "RLO", "RBG", "RDG", "RJP", "RRD", "RECH", "REN", "RU", "RNQ", "RNW", "RBK", "RAL", "RAKL", "REWA", "RE", "RR", "RCGT", "RID", "RGS", "RSA", "RKSH", "RIS", "RS", "REI", "RJPB", "RSWT", "RQJ", "RBGJ", "ROHA", "RNA", "RHNE", "ROK", "RK", "RORA", "RHN", "RGO", "ROU", "RWTB", "RAC", "RDL", "RUPC", "RUPR", "RKD", "RNJ", "RNH", "RPI", "RUP", "RUM", "RPD", "RPB", "RBS", "RPAR", "RNPR", "RPRD", "ROP", "RRH", "ROA", "RTA", "SNC", "SBL", "SBIC", "SBI", "SBT", "SBIS", "SBO", "SABRM", "SCH", "DSB", "SDT", "SDY", "SDE", "SDLP", "SDS", "DSJ", "SFH", "SDI", "SRF", "SVI", "SGL", "SAO", "SRE", "SHC", "STW", "SWRT", "SBB", "SBG", "SKJ", "SWA", "SSPN", "SYK", "SYJ", "SNT", "SYWN", "SJF", "SVJ", "SLD", "SKPN", "SIL", "SKF", "SKR", "SKLR", "SKI", "SKGH", "SKT", "SLKX", "SMT", "SALE", "SLRP", "SZ", "SCA", "SKS", "SA", "SAMT", "SXT", "SJSM", "SRU", "SLR", "SLON", "SYL", "SALR", "SAL", "SMGR", "SIO", "SIOB", "SMK", "SLY", "SLO", "SPJ", "SMBX", "SBP", "SBPD", "SBR", "SMR", "SMLA", "SPZ", "SRK", "SM", "SNL", "SAU", "SWU", "SWD", "SCI", "SLKN", "SAN", "SNF", "SNRD", "SNX", "SNGR", "SNGN", "SGRR", "SGRA", "SGF", "SLI", "SGR", "SGLA", "SNU", "SBS", "SAG", "SAC", "SJN", "SNKL", "SGE", "SKVL", "SNSR", "SOA", "", "SAT", "STC", "SNTD", "SNLR", "SNTBR", "DCR", "SNVR", "SVO", "SPX", "SAH", "SDH", "SYC", "SVZ", "SQN", "SMZ", "RKS", "SFW", "SANR", "SRDR", "SGAM", "SSR", "SIQ", "SRNT", "SOJ", "SRL", "SZA", "SSW", "SZR", "SVD", "SASG", "SSM", "SNS", "STDR", "STR", "STJT", "SAA", "SWF", "STA", "STNL", "SCO", "SRT", "SGO", "SVX", "SVKD", "SAV", "SWM", "SWMM", "SWV", "SDAH", "", "SC", "SEH", "SW", "SELU", "SRKI", "SEN", "SCE", "SEU", "SCT", "SEO", "SHE", "SEM", "SRP", "SET", "SEGM", "SVL", "SWPR", "SVE", "SHDR", "SDB", "SHAD", "SHS", "SHDM", "", "SDL", "SHG", "SPN", "SPP", "SAR", "SXK", "SFY", "SKTN", "SSB", "SMP", "SGZ", "SJS", "SRJ", "SKP", "STB", "SHH", "SHRM", "SAS", "SED", "SEG", "SHK", "", "SEI", "SNE", "SHNX", "SOE", "SRKN", "SRTL", "SKB", "SML", "SME", "SMET", "SNSI", "", "SHMI", "SIW", "SS", "SOP", "", "WSC", "SHNG", "SVW", "SVPI", "SWC", "CSB", "SGS", "SOT", "SURC", "SDN", "SRR", "SIM", "SGNR", "SRW", "SMPR", "SMBJ", "SVDK", "SRID", "SGND", "SKPA", "NGZ", "SAGR", "S", "SVGL", "SJT", "SJP", "SNR", "SWJ", "SRTN", "SID", "SD", "SDMK", "SIPR", "SIHO", "SOJN", "SHR", "SKQ", "SKA", "SIKR", "SFK", "SOB", "SILO", "SPTR", "SLT", "SCL", "SGUJ", "SGUT", "SLF", "SLGR", "SAE", "SMBL", "SMCP", "SCM", "SLG", "STL", "SMX", "SNDD", "SNI", "SNK", "SDPN", "SNDT", "SYW", "SHIN", "SPRD", "SKM", "SYI", "SNPR", "SGRL", "SGW", "SINI", "SIN", "SRAS", "SRO", "SIR", "SY", "SIF", "SOH", "SKZR", "SRUR", "SIRN", "SSA", "SSKA", "SVHE", "SBZ", "SMI", "STP", "SCC", "SPC", "STN", "SEV", "STLI", "SII", "SVGA", "SVJR", "SVKS", "SWE", "SV", "SWNI", "SDP", "SGP", "SLW", "SOD", "SJTR", "SOL", "SBY", "SUR", "SURM", "SNO", "SOS", "SOM", "SMNH", "SPT", "SEB", "SOR", "SPR", "SCN", "SNN", "SGD", "SONI", "SIC", "SNP", "SEE", "SWO", "SBE", "SPQ", "SORO", "SRN", "SDGH", "KHT", "CHE", "SKN", "SRNR", "SRPB", "SRGM", "SVPR", "SUZ", "SFG", "SBHR", "SZM", "SCPD", "SDF", "SUJH", "SJNP", "SUW", "SRHA", "SUKP", "SQF", "SUL", "SLHP", "SGRE", "SPE", "SGG", "SLN", "SQR", "SUU", "SUMR", "SUDV", "SHZ", "SMRR", "SFM", "SPL", "SNBD", "SDLK", "SOU", "SIP", "SRGH", "SUPR", "SJQ", "ST", "SOG", "SL", "SRVX", "SURL", "SUNR", "SAW", "SLRD", "SPO", "SWS", "SVA", "SWI", "SRPJ", "TAE", "TDD", "TU", "TVL", "TSD", "TSF", "TJP", "TJD", "TMZ", "TMA", "TAKL", "TKR", "TKHE", "TQA", "TSL", "TAKU", "TAY", "TLRA", "TLKH", "TAV", "TLZ", "TBT", "TLHR", "TLC", "TGN", "TLGP", "THJ", "TSS", "TOD", "", "TWB", "TBM", "TOI", "TPU", "TDO", "TDU", "TNL", "TRA", "TKN", "TNKU", "TA", "TAPA", "TPZ", "TRBE", "TVI", "TNX", "TAN", "TRAH", "TRR", "TEA", "TAZ", "TRG", "TRL", "TTO", "TRSR", "TRSR", "TATA", "TBH", "TIS", "TGA", "TKA", "TQM", "TLY", "TEL", "TENI", "TSI", "TML", "TTLA", "TET", "TZTB", "TKC", "", "THAN", "THB", "THDR", "TNA", "TJ", "THMR", "THE", "TGE", "THV", "TCR", "TVC", "TMVL", "TI", "TVP", "TVR", "TRL", "THVM", "TOK", "THUR", "TIBI", "TIHU", "TKYR", "TKKD", "TQN", "TKJ", "TKNG", "TIU", "TIA", "TLD", "TLH", "TIL", "TWL", "TBN", "TBA", "TMX", "TGT", "TMV", "TPH", "TSK", "TPK", "TPG", "TTR", "TP", "TRDI", "TRO", "TPJ", "TCN", "TPE", "TRK", "TMQ", "TRM", "TEN", "TDPR", "TPTY", "TPT", "CUD", "TUP", "TIR", "TRT", "TTL", "TTP", "TRVL", "TNM", "TRB", "TDR", "TVT", "TISI", "TSA", "TTB", "TGH", "TIG", "TL", "TIW", "TDP", "TUN", "TNGL", "TORI", "TCR", "TKQ", "TLMD", "TRTR", "TNP", "TSR", "TKD", "TTZ", "TLR", "TLI", "TK", "TMR", "TDL", "TUNI", "TUH", "TTI", "TME", "TN", "TUWA", "TWG", "TXD", "UBN", "UCA", "UCP", "UAM", "UDZ", "UDKN", "UDPU", "UDPR", "URP", "ULG", "UKR", "UDS", "UDGR", "UHP", "UDN", "UMS", "UD", "UVD", "UWNR", "UDK", "UGN", "UGR", "UGP", "UGNA", "URPR", "UGU", "UGWE", "UJ", "UJH", "UJP", "UJN", "USD", "UKH", "UKA", "UKLH", "UKN", "UKC", "UPD", "ULNR", "UKD", "ULL", "ULL", "ULB", "ULU", "UTA", "UM", "UMR", "UIH", "UMPD", "UBR", "UR", "UMED", "UMNR", "UMRA", "ULA", "UMM", "URR", "UMH", "UMRI", "UOI", "UNA", "UHL", "UN", "UNLA", "UCR", "UCH", "UND", "UHR", "UCB", "UDM", "UNDI", "VGT", "UNL", "URL", "UJA", "UNK", "ON", "URD", "UPI", "UA", "OPL", "UAA", "UPW", "UPL", "HPG", "UGD", "UPM", "UDX", "UREN", "URGA", "URK", "ULM", "URMA", "URI", "USL", "USK", "UB", "UPR", "USRA", "UTL", "UTD", "UTR", "URN", "UTP", "UKV", "UMG", "UTN", "UPA", "UKL", "UDT", "VOC", "VPH", "VRJ", "BDJ", "VAL", "VAE", "VLTR", "VLU", "VDM", "VDKS", "VDN", "VDGN", "VAN", "VDP", "VDV", "VMD", "VDG", "VXD", "BRC", "VTL", "VVL", "VD", "VGL", "VBW", "VARD", "VPZ", "VTN", "VDL", "WKA", "VLDR", "VLDE", "VTV", "VAPM", "VGE", "VMM", "VLT", "VRA", "WLH", "VV", "VBN", "VLYN", "VMP", "VTK", "VLI", "VLV", "VLY", "VKNR", "BL", "VPJ", "VBR", "VDR", "VGI", "VRN", "VGN", "VGL", "VNRD", "VLG", "VN", "VN", "VNB", "MEJ", "VKL", "VAPI", "VRX", "VKP", "BCY", "BSB", "VNA", "VRE", "VAK", "VRKD", "VRM", "VTJ", "VVA", "VDA", "BSR", "WSE", "VSG", "V", "VSD", "VASO", "VTP", "VAT", "VTA", "VVD", "VKG", "VVV", "VAY", "VLD", "ZPH", "VDE", "VDH", "VEER", "VJK", "VJA", "VLCY", "VLC", "VDI", "VEL", "VEK", "VLL", "VXM", "VEI", "VO", "VLR", "VT", "VER", "VPU", "VEP", "VMU", "VDD", "VND", "VKT", "VKI", "VTE/H", "VPL", "VKZ", "VKR", "VPG", "VGA", "VEU", "VRL", "VKA", "VEN", "VTM", "BHS", "VWA", "VAR", "VPN", "VDS", "VVH", "VJP", "VZ", "VJR", "BZA", "VJPJ", "VJD", "VKB", "VKH", "VK", "VMA", "VRG", "VVN", "VL", "VID", "VYK", "VLP", "VLN", "VI", "VLK", "VB", "VM", "BDL", "VINH", "VGM", "VKD", "VQD", "VG", "VRLR", "VRPD", "VP", "VR", "VRQ", "VRV", "VRVL", "VVM", "VRH", "VJ", "VCN", "VOL", "VRR", "VPT", "VUL", "VSKP", "VPR", "VSW", "VNUP", "VRB", "VS/VSI", "VNG", "VNE", "VLDI", "VVB", "VVKP", "VZM", "VOC", "VON", "VRI", "VRT", "VRDB", "VYA", "VJM", "VYN", "WKI", "BPTW", "WDG", "WC", "WADI", "WDR", "WDA", "WSA", "WDS", "WDLN", "WGI", "WGA", "WAIR", "WJ", "WJR", "WRA", "WND", "WDL", "WDJ", "WNG", "WP", "WANI", "WKRC", "WKR", "WPR", "WSJ", "WL", "WRE", "WR", "OYR", "WRGN", "WRS", "WRR", "WARUD", "WRD", "VSP", "WST", "WHM", "WSB", "WSD", "WTR", "WZJ", "WEL", "WENA", "WH", "MBM", "WFD", "VHGN", "WCN", "WIRR", "WRC", "WDM", "YDLP", "YG", "YDD", "YDV", "YKA", "YLG", "JAB", "JSB", "YAG", "YAL", "YTL", "YDM", "YDP", "YDK", "YSI", "YNK", "YGL", "Y", "YLK", "YL", "YS", "YPD", "YGA", "YA", "YPR", "YAD", "YT", "YEAM", "YFP", "ZBD", "ZB", "ZNA", "ZPI", "ZPL", "ZNK", "ZARP", "ZP", "ZW", "ZNP"];
    var temp_names=["KalyanJunction","JabalpurJunction"];
	
	
	
    var source=casper.cli.get(1);
	var destination=casper.cli.get(2);
	var date=casper.cli.get(3);
	var code=casper.cli.get(4);
	
	var day=date.substring(0,2);
	var month=date.substring(3,5);
	var year=date.substring(6,10);
	if(day.charAt(0)=='0')
	day=day.substring(1);
	if(month.charAt(0)=='0')
	month=month.substring(1);
	
	
	var key1=source.charAt(0);
	//console.log("--->",source,destination,date);
	
	var index=[0,213,697,889,1156,1177,1208,1388,1511,1543,1704,1894,1988,2333,2530,2540,2771,2772,2953,3355,3525,3635,3828,3889,3909];
	
	if(key1=='A'){
	var key=0;
	}else if(key1=='B'){
	var key=213;
	}if(key1=='C'){
	var key=697;
	}else if(key1=='D'){
	var key=889;
	}if(key1=='E'){
	var key=1156;
	}else if(key1=='F'){
	var key=1177;
	}if(key1=='G'){
	var key=1208;
	}else if(key1=='H'){
	var key=1388;
	}if(key1=='I'){
	var key=1511;
	}else if(key1=='J'){
	var key=1543;
	}if(key1=='K'){
	var key=1704;
	}else if(key1=='L'){
	var key=1894;
	}if(key1=='M'){
	var key=1988;
	}else if(key1=='N'){
	var key=2333;
	}if(key1=='O'){
	var key=2530;
	}else if(key1=='P'){
	var key=2540;
	}if(key1=='Q'){
	var key=2771;
	}else if(key1=='R'){
	var key=2772;
	}if(key1=='S'){
	var key=2953;
	}else if(key1=='T'){
	var key=3355;
	}if(key1=='U'){
	var key=3525;
	}else if(key1=='V'){
	var key=3635;
	}if(key1=='W'){
	var key=3828;
	}else if(key1=='Y'){
	var key=3889;
	}if(key1=='Z'){
	var key=3909;
	}
	
	for(var i=key;i<3920;i++){
	if(names[i]==source){
	var source_code=codes[i];
	break;
	}
	}
	
	key1=destination.charAt(0);
	
	if(key1=='A'){
	var key=0;
	}else if(key1=='B'){
	var key=213;
	}if(key1=='C'){
	var key=697;
	}else if(key1=='D'){
	var key=889;
	}if(key1=='E'){
	var key=1156;
	}else if(key1=='F'){
	var key=1177;
	}if(key1=='G'){
	var key=1208;
	}else if(key1=='H'){
	var key=1388;
	}if(key1=='I'){
	var key=1511;
	}else if(key1=='J'){
	var key=1543;
	}if(key1=='K'){
	var key=1704;
	}else if(key1=='L'){
	var key=1894;
	}if(key1=='M'){
	var key=1988;
	}else if(key1=='N'){
	var key=2333;
	}if(key1=='O'){
	var key=2530;
	}else if(key1=='P'){
	var key=2540;
	}if(key1=='Q'){
	var key=2771;
	}else if(key1=='R'){
	var key=2772;
	}if(key1=='S'){
	var key=2953;
	}else if(key1=='T'){
	var key=3355;
	}if(key1=='U'){
	var key=3525;
	}else if(key1=='V'){
	var key=3635;
	}if(key1=='W'){
	var key=3828;
	}else if(key1=='Y'){
	var key=3889;
	}if(key1=='Z'){
	var key=3909;
	}
	
	for(var i=key;i<3920;i++){
	if(names[i]==destination){
	var destination_code=codes[i];
	break;
	}
	}
	
	
	var baseurl="https://railways.makemytrip.com/railways/railListing?trackingId=AYIHGP2KRB1502794957690&checkTrainRoute=true&date=";
	baseurl=baseurl.concat(month,"%2F",day,"%2F",year,"&srcStn=",source_code,"&srcCity=&destStn=",destination_code,"&destCity=&trip=oneWay&classCode=",code,"&FD=false&FC=false&__checkbox_FD=true&__checkbox_FC=true&affiliateId=&channelId=");
	
	console.log("BASEURL=",baseurl);
	
	casper.userAgent('Mozilla/5.0 (Windows NT 6.0) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/13.0.782.41 Safari/535.1');
		casper.start(baseurl,function(){
		});
		console.log("URL loaded......");

	casper.then(function() {
	//logic here
	this.waitForSelector(".chf_wrapper.chf_clearFix",

		function pass () {
		console.log("Continue");
		this.capture('screener.png'); 
		},
		function fail () {
        this.die("Did not load element... something is wrong");
		this.capture('screener.png'); 
		});
		
	//console.log("just before running......");
	});

	casper.on('remote.message', function(msg) {
	casper.echo(msg);
	});


	//start your script
	casper.run(function(){
	console.log("running......");
	var links = this.evaluate(function(){
		var results = new Array(); 
		var t=0;
		var elts=document.querySelectorAll("tbody.yui-dt-data")[0].getElementsByTagName("tr");
		
		for(var i=0;i<elts.length;i++)
		{
				var name,number,arrival,departure,seats,fare;
				var info=elts[i].innerText;
				if(info.indexOf("Not Available")!=-1)
				continue;
				
				//this.click('.flt-left.NL-view');
				/*var x = require('casper').selectXPath;
				click(x('(//a[@class="flt-left.NL-view"])[1]'));*/
				//casper.click("a[class='flt-left.NL-view']");
				//elts[i].getElementsByTagName("td")[6].getElementsByTagName("div")[0].getElementsByTagName("a")[1].click();
				info=elts[i].innerText;

				info=info.replace('Route','');
				if(info.indexOf("Day 2")!=-1)
				info=info.replace('Day 2','');
				if(info.indexOf("Day 3")!=-1)
				info=info.replace('Day 3','');
		
					info=info.replace('Normal','');info=info.replace('Tatkal','');
					info=info.replace('\n','');
					info=info.replace('\n','*');info=info.replace('\n','*');info=info.replace('\n','*');info=info.replace('\n','*');info=info.replace('\n','*');
					info=info.replace('\n','*');info=info.replace('\n','*');info=info.replace('\n','*');
					info=info.replace('**','*');
					console.log("INFO=",info);
					
		
			var c=0;
			var prev=-1;
			for(var j=0;j<info.length;j++)
			{
	
					if(info.charAt(j)=='*')
					{
							if(c==0)
							number=info.substring(prev+1,j);
							else if(c==1)
							name=info.substring(prev+1,j);
							else if(c==2)
							arrival=info.substring(prev+1,j); 
							else if(c==3)
							departure=info.substring(prev+1,j); 
							else if(c==4)
							fare=info.substring(prev+1,j);
					
					
					c++;
					prev=j;
					}
		
			
					if(c==5)
					{
					results[t]=new Array();
						results[t][0]=name;
						results[t][1]=number;
						results[t][2]=arrival;
						results[t][3]=departure;
						results[t][4]=fare;
						
					
					t++;
					c=0;
					}
			}
		
		}
		//No. of Trains

return results; 
});
	
	for(var i=0;i<links.length;i++)
	{
	console.log("_______________________________________________________________");	
	console.log(links[i][0],"\n",links[i][1],"\n",links[i][2],"\n",links[i][3],"\n",links[i][4],"\n");
	}
	this.die('\n'+'Done');
	});
	//run closing
	
}
