"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Station {
  lat: number;
  lng: number;
  municipality: string;
  province: string;
  region: string;
}

interface StationDisclaimer {
  stationName: string;
  disclaimer: string;
}

// ─── Station Data ─────────────────────────────────────────────────────────────
const STATIONS: Station[] = [
  {"lat":20.45842208,"lng":121.9926254,"municipality":"BASCO","province":"BATANES","region":"2"},
  {"lat":20.75760487,"lng":121.8377097,"municipality":"ITBAYAT","province":"BATANES","region":"2"},
  {"lat":20.37607313,"lng":121.9267892,"municipality":"IVANA","province":"BATANES","region":"2"},
  {"lat":20.41071917,"lng":121.9511489,"municipality":"MAHATAO","province":"BATANES","region":"2"},
  {"lat":20.31099739,"lng":121.8512103,"municipality":"SABTANG","province":"BATANES","region":"2"},
  {"lat":20.37478154,"lng":121.9536795,"municipality":"UYUGAN","province":"BATANES","region":"2"},
  {"lat":18.43969126,"lng":121.4453919,"municipality":"ABULUG","province":"CAGAYAN","region":"2"},
  {"lat":17.90756861,"lng":121.6605556,"municipality":"ALCALA","province":"CAGAYAN","region":"2"},
  {"lat":18.22413315,"lng":121.5501002,"municipality":"ALLACAPAN","province":"CAGAYAN","region":"2"},
  {"lat":17.82296442,"lng":121.7044876,"municipality":"AMULUNG","province":"CAGAYAN","region":"2"},
  {"lat":18.35383756,"lng":121.6407485,"municipality":"APARRI","province":"CAGAYAN","region":"2"},
  {"lat":17.93236782,"lng":121.7718649,"municipality":"BAGGAO","province":"CAGAYAN","region":"2"},
  {"lat":18.36025809,"lng":121.507097,"municipality":"BALLESTEROS","province":"CAGAYAN","region":"2"},
  {"lat":18.27979964,"lng":121.8268333,"municipality":"BUGUEY","province":"CAGAYAN","region":"2"},
  {"lat":19.25485039,"lng":121.4862366,"municipality":"CALAYAN","province":"CAGAYAN","region":"2"},
  {"lat":18.27026763,"lng":121.6857549,"municipality":"CAMALANIUGAN","province":"CAGAYAN","region":"2"},
  {"lat":18.56125192,"lng":121.0974953,"municipality":"CLAVERIA","province":"CAGAYAN","region":"2"},
  {"lat":17.55884939,"lng":121.6938747,"municipality":"ENRILE","province":"CAGAYAN","region":"2"},
  {"lat":18.05814926,"lng":121.8597688,"municipality":"GATTARAN","province":"CAGAYAN","region":"2"},
  {"lat":18.25540691,"lng":122.1257933,"municipality":"GONZAGA","province":"CAGAYAN","region":"2"},
  {"lat":17.75346865,"lng":121.7489091,"municipality":"IGUIG","province":"CAGAYAN","region":"2"},
  {"lat":18.16024509,"lng":121.8627709,"municipality":"LAL LO","province":"CAGAYAN","region":"2"},
  {"lat":18.05324184,"lng":121.5425531,"municipality":"LASAM","province":"CAGAYAN","region":"2"},
  {"lat":18.44562303,"lng":121.3261994,"municipality":"PAMPLONA","province":"CAGAYAN","region":"2"},
  {"lat":17.67808774,"lng":121.9757155,"municipality":"PENABLANCA","province":"CAGAYAN","region":"2"},
  {"lat":17.77224669,"lng":121.5324178,"municipality":"PIAT","province":"CAGAYAN","region":"2"},
  {"lat":17.83805204,"lng":121.3936252,"municipality":"RIZAL","province":"CAGAYAN","region":"2"},
  {"lat":18.52140182,"lng":121.2042899,"municipality":"SANCHEZ MIRA","province":"CAGAYAN","region":"2"},
  {"lat":18.43626022,"lng":122.2590332,"municipality":"SANTA ANA","province":"CAGAYAN","region":"2"},
  {"lat":18.53151575,"lng":120.9993143,"municipality":"SANTA PRAXEDES","province":"CAGAYAN","region":"2"},
  {"lat":18.23518184,"lng":121.9089686,"municipality":"SANTA TERESITA","province":"CAGAYAN","region":"2"},
  {"lat":17.92192203,"lng":121.5056601,"municipality":"SANTO NINO","province":"CAGAYAN","region":"2"},
  {"lat":17.6750997,"lng":121.6476101,"municipality":"SOLANA","province":"CAGAYAN","region":"2"},
  {"lat":17.69478969,"lng":121.5059973,"municipality":"TUAO","province":"CAGAYAN","region":"2"},
  {"lat":17.60612443,"lng":121.7593619,"municipality":"TUGUEGARAO CITY","province":"CAGAYAN","region":"2"},
  {"lat":16.8142135,"lng":121.6776034,"municipality":"ALICIA","province":"ISABELA","region":"2"},
  {"lat":16.7811553,"lng":121.7956688,"municipality":"ANGADANAN","province":"ISABELA","region":"2"},
  {"lat":16.98168537,"lng":121.6370366,"municipality":"AURORA","province":"ISABELA","region":"2"},
  {"lat":16.8961159,"lng":121.9410938,"municipality":"BENITO SOLIVEN","province":"ISABELA","region":"2"},
  {"lat":17.05082653,"lng":121.7267032,"municipality":"BURGOS","province":"ISABELA","region":"2"},
  {"lat":17.37532111,"lng":121.8524674,"municipality":"CABAGAN","province":"ISABELA","region":"2"},
  {"lat":16.93702658,"lng":121.6664393,"municipality":"CABATUAN","province":"ISABELA","region":"2"},
  {"lat":16.90109749,"lng":121.799819,"municipality":"CAUAYAN CITY","province":"ISABELA","region":"2"},
  {"lat":16.68347861,"lng":121.4614933,"municipality":"CORDON","province":"ISABELA","region":"2"},
  {"lat":17.26585875,"lng":121.7480607,"municipality":"DELFIN ALBANO","province":"ISABELA","region":"2"},
  {"lat":16.67605667,"lng":122.2438943,"municipality":"DINAPIGUE","province":"ISABELA","region":"2"},
  {"lat":17.27781463,"lng":122.1679847,"municipality":"DIVILACAN","province":"ISABELA","region":"2"},
  {"lat":16.62979166,"lng":121.8266883,"municipality":"ECHAGUE","province":"ISABELA","region":"2"},
  {"lat":17.0707603,"lng":121.8116328,"municipality":"GAMU","province":"ISABELA","region":"2"},
  {"lat":17.10166188,"lng":121.8658175,"municipality":"ILAGAN CITY","province":"ISABELA","region":"2"},
  {"lat":16.55859436,"lng":121.7782794,"municipality":"JONES","province":"ISABELA","region":"2"},
  {"lat":16.97706067,"lng":121.7319096,"municipality":"LUNA","province":"ISABELA","region":"2"},
  {"lat":17.36289816,"lng":122.1340359,"municipality":"MACONACON","province":"ISABELA","region":"2"},
  {"lat":17.17410737,"lng":121.6244543,"municipality":"MALLIG","province":"ISABELA","region":"2"},
  {"lat":16.99691603,"lng":121.8760488,"municipality":"NAGUILIAN","province":"ISABELA","region":"2"},
  {"lat":17.0432695,"lng":122.5037707,"municipality":"PALANAN","province":"ISABELA","region":"2"},
  {"lat":17.28769528,"lng":121.6211891,"municipality":"QUEZON","province":"ISABELA","region":"2"},
  {"lat":17.15888598,"lng":121.7454697,"municipality":"QUIRINO","province":"ISABELA","region":"2"},
  {"lat":16.80386593,"lng":121.5252006,"municipality":"RAMON","province":"ISABELA","region":"2"},
  {"lat":17.00612036,"lng":121.7981675,"municipality":"REINA MERCEDES","province":"ISABELA","region":"2"},
  {"lat":17.09782081,"lng":121.6214238,"municipality":"ROXAS CITY","province":"ISABELA","region":"2"},
  {"lat":16.478064,"lng":121.83421,"municipality":"SAN AGUSTIN","province":"ISABELA","region":"2"},
  {"lat":16.69352317,"lng":121.9850591,"municipality":"SAN GUILLERMO","province":"ISABELA","region":"2"},
  {"lat":16.74397426,"lng":121.6259805,"municipality":"SAN ISIDRO","province":"ISABELA","region":"2"},
  {"lat":17.03159648,"lng":121.6230273,"municipality":"SAN MANUEL","province":"ISABELA","region":"2"},
  {"lat":16.87665402,"lng":122.152485,"municipality":"SAN MARIANO","province":"ISABELA","region":"2"},
  {"lat":16.87377009,"lng":121.600106,"municipality":"SAN MATEO","province":"ISABELA","region":"2"},
  {"lat":17.47063295,"lng":122.0054251,"municipality":"SAN PABLO CITY","province":"ISABELA","region":"2"},
  {"lat":17.4737655,"lng":121.7281809,"municipality":"SANTA MARIA","province":"ISABELA","region":"2"},
  {"lat":16.72164916,"lng":121.4947972,"municipality":"SANTIAGO CITY","province":"ISABELA","region":"2"},
  {"lat":17.36646499,"lng":121.7532419,"municipality":"SANTO TOMAS","province":"ISABELA","region":"2"},
  {"lat":17.27058663,"lng":121.8956687,"municipality":"TUMAUINI","province":"ISABELA","region":"2"},
  {"lat":15.91073651,"lng":121.3247196,"municipality":"ALFONSO CASTANEDA","province":"NUEVA VIZCAYA","region":"2"},
  {"lat":16.55062038,"lng":121.0476454,"municipality":"AMBAGUIO","province":"NUEVA VIZCAYA","region":"2"},
  {"lat":16.24345956,"lng":121.0297837,"municipality":"ARITAO","province":"NUEVA VIZCAYA","region":"2"},
  {"lat":16.58630016,"lng":121.2718478,"municipality":"BAGABAG","province":"NUEVA VIZCAYA","region":"2"},
  {"lat":16.39122947,"lng":121.1164051,"municipality":"BAMBANG","province":"NUEVA VIZCAYA","region":"2"},
  {"lat":16.48068376,"lng":121.141156,"municipality":"BAYOMBONG","province":"NUEVA VIZCAYA","region":"2"},
  {"lat":16.62644849,"lng":121.354932,"municipality":"DIADI","province":"NUEVA VIZCAYA","region":"2"},
  {"lat":16.20589392,"lng":121.2362502,"municipality":"DUPAX DEL NORTE","province":"NUEVA VIZCAYA","region":"2"},
  {"lat":16.1149654,"lng":121.1863192,"municipality":"DUPAX DEL SUR","province":"NUEVA VIZCAYA","region":"2"},
  {"lat":16.35766132,"lng":121.3291718,"municipality":"KASIBU","province":"NUEVA VIZCAYA","region":"2"},
  {"lat":16.40911476,"lng":120.918355,"municipality":"KAYAPA","province":"NUEVA VIZCAYA","region":"2"},
  {"lat":16.46985688,"lng":121.2945721,"municipality":"QUEZON","province":"NUEVA VIZCAYA","region":"2"},
  {"lat":16.18130633,"lng":120.9169147,"municipality":"SANTA FE","province":"NUEVA VIZCAYA","region":"2"},
  {"lat":16.53470398,"lng":121.1895252,"municipality":"SOLANO","province":"NUEVA VIZCAYA","region":"2"},
  {"lat":16.6010159,"lng":121.1618362,"municipality":"VILLAVERDE","province":"NUEVA VIZCAYA","region":"2"},
  {"lat":16.43386877,"lng":121.6200936,"municipality":"AGLIPAY","province":"QUIRINO","region":"2"},
  {"lat":16.43744277,"lng":121.5060662,"municipality":"CABARROGUIS","province":"QUIRINO","region":"2"},
  {"lat":16.55243685,"lng":121.4613743,"municipality":"DIFFUN","province":"QUIRINO","region":"2"},
  {"lat":16.36043622,"lng":121.7984717,"municipality":"MADDELA","province":"QUIRINO","region":"2"},
  {"lat":16.15603161,"lng":121.5122742,"municipality":"NAGTIPUNAN","province":"QUIRINO","region":"2"},
  {"lat":16.54521129,"lng":121.5795794,"municipality":"SAGUDAY","province":"QUIRINO","region":"2"},
  {"lat":15.73289811,"lng":121.5719323,"municipality":"BALER","province":"AURORA","region":"3"},
  {"lat":16.14053917,"lng":122.0684204,"municipality":"CASIGURAN","province":"AURORA","region":"3"},
  {"lat":16.43294525,"lng":122.1339116,"municipality":"DILASAG","province":"AURORA","region":"3"},
  {"lat":16.1685601,"lng":121.8597005,"municipality":"DINALUNGAN","province":"AURORA","region":"3"},
  {"lat":15.28386974,"lng":121.3825378,"municipality":"DINGALAN","province":"AURORA","region":"3"},
  {"lat":15.88333035,"lng":121.5511093,"municipality":"DIPACULAO","province":"AURORA","region":"3"},
  {"lat":15.776757,"lng":121.403354,"municipality":"MARIA AURORA","province":"AURORA","region":"3"},
  {"lat":15.48857975,"lng":121.4871979,"municipality":"SAN LUIS","province":"AURORA","region":"3"},
  {"lat":14.71799365,"lng":120.4848843,"municipality":"ABUCAY","province":"BATAAN","region":"3"},
  {"lat":14.5841313,"lng":120.4258517,"municipality":"BAGAC","province":"BATAAN","region":"3"},
  {"lat":14.66714894,"lng":120.4928636,"municipality":"BALANGA CITY","province":"BATAAN","region":"3"},
  {"lat":14.86964611,"lng":120.4319221,"municipality":"DINALUPIHAN","province":"BATAAN","region":"3"},
  {"lat":14.81326637,"lng":120.4474461,"municipality":"HERMOSA","province":"BATAAN","region":"3"},
  {"lat":14.53879008,"lng":120.5544423,"municipality":"LIMAY","province":"BATAAN","region":"3"},
  {"lat":14.44888973,"lng":120.5897217,"municipality":"MARIVELES","province":"BATAAN","region":"3"},
  {"lat":14.79314,"lng":120.260002,"municipality":"MORONG","province":"BATAAN","region":"3"},
  {"lat":14.77844066,"lng":120.477415,"municipality":"ORANI","province":"BATAAN","region":"3"},
  {"lat":14.60294533,"lng":120.5516269,"municipality":"ORION","province":"BATAAN","region":"3"},
  {"lat":14.63033644,"lng":120.52021,"municipality":"PILAR","province":"BATAAN","region":"3"},
  {"lat":14.75279679,"lng":120.4825571,"municipality":"SAMAL","province":"BATAAN","region":"3"},
  {"lat":14.92996564,"lng":121.0356406,"municipality":"ANGAT","province":"BULACAN","region":"3"},
  {"lat":14.82773861,"lng":120.9208202,"municipality":"BALAGTAS","province":"BULACAN","region":"3"},
  {"lat":14.95149729,"lng":120.901636,"municipality":"BALIWAG","province":"BULACAN","region":"3"},
  {"lat":14.79008857,"lng":120.9406425,"municipality":"BOCAUE","province":"BULACAN","region":"3"},
  {"lat":14.76566995,"lng":120.8765545,"municipality":"BULAKAN","province":"BULACAN","region":"3"},
  {"lat":14.92271804,"lng":120.9518684,"municipality":"BUSTOS","province":"BULACAN","region":"3"},
  {"lat":14.89266566,"lng":120.7796319,"municipality":"CALUMPIT","province":"BULACAN","region":"3"},
  {"lat":15.06335258,"lng":121.2089983,"municipality":"DONA REMEDIOS TRINIDAD","province":"BULACAN","region":"3"},
  {"lat":14.83746463,"lng":120.8923363,"municipality":"GUIGUINTO","province":"BULACAN","region":"3"},
  {"lat":14.8077632,"lng":120.741618,"municipality":"HAGONOY","province":"BULACAN","region":"3"},
  {"lat":14.8295864,"lng":120.8367451,"municipality":"MALOLOS CITY","province":"BULACAN","region":"3"},
  {"lat":14.76855633,"lng":120.9880032,"municipality":"MARILAO","province":"BULACAN","region":"3"},
  {"lat":14.73464108,"lng":120.9956589,"municipality":"MEYCAUAYAN","province":"BULACAN","region":"3"},
  {"lat":14.87897558,"lng":121.1813151,"municipality":"NORZAGARAY","province":"BULACAN","region":"3"},
  {"lat":14.71379999,"lng":120.926668,"municipality":"OBANDO","province":"BULACAN","region":"3"},
  {"lat":14.87472457,"lng":120.9667452,"municipality":"PANDI","province":"BULACAN","region":"3"},
  {"lat":14.80476971,"lng":120.795121,"municipality":"PAOMBONG","province":"BULACAN","region":"3"},
  {"lat":14.88227816,"lng":120.8828719,"municipality":"PLARIDEL","province":"BULACAN","region":"3"},
  {"lat":14.91386664,"lng":120.8556301,"municipality":"PULILAN","province":"BULACAN","region":"3"},
  {"lat":15.05010751,"lng":121.0337714,"municipality":"SAN ILDEFONSO","province":"BULACAN","region":"3"},
  {"lat":14.7785902,"lng":121.0547333,"municipality":"SAN JOSE DEL MONTE","province":"BULACAN","region":"3"},
  {"lat":15.17310142,"lng":121.0401182,"municipality":"SAN MIGUEL","province":"BULACAN","region":"3"},
  {"lat":14.98345278,"lng":120.9914686,"municipality":"SAN RAFAEL","province":"BULACAN","region":"3"},
  {"lat":14.83218966,"lng":120.998676,"municipality":"SANTA MARIA","province":"BULACAN","region":"3"},
  {"lat":15.50732555,"lng":120.8591589,"municipality":"ALIAGA","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.65138793,"lng":121.2313498,"municipality":"BONGABON","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.49243694,"lng":120.9899426,"municipality":"CABANATUAN CITY","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.23440148,"lng":120.849585,"municipality":"CABIAO","province":"NUEVA ECIJA","region":"3"},
  {"lat":16.00314725,"lng":121.0411996,"municipality":"CARRANGLAN","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.79299044,"lng":120.699913,"municipality":"CUYAPO","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.51859204,"lng":121.2928871,"municipality":"GABALDON","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.28284213,"lng":121.005354,"municipality":"GAPAN CITY","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.58757592,"lng":121.0459314,"municipality":"GENERAL MAMERTO NATIVIDAD","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.34018887,"lng":121.2179215,"municipality":"GENERAL TINIO","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.6667207,"lng":120.7561611,"municipality":"GUIMBA","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.37921064,"lng":120.8788858,"municipality":"JAEN","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.52335028,"lng":121.1788592,"municipality":"LAUR","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.55126233,"lng":120.7599515,"municipality":"LICAB","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.66229281,"lng":120.9940334,"municipality":"LLANERA","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.8473168,"lng":120.9125204,"municipality":"LUPAO","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.72036376,"lng":120.6612481,"municipality":"NAMPICUAN","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.52215218,"lng":121.1048464,"municipality":"PALAYAN CITY","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.80859757,"lng":121.1590586,"municipality":"PANTABANGAN","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.35498908,"lng":121.0252293,"municipality":"PENARANDA","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.57843153,"lng":120.8258812,"municipality":"QUEZON","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.68671861,"lng":121.1074139,"municipality":"RIZAL","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.33154163,"lng":120.809805,"municipality":"SAN ANTONIO","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.26484862,"lng":120.9136559,"municipality":"SAN ISIDRO","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.78462184,"lng":120.9975839,"municipality":"SAN JOSE","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.35961072,"lng":120.9474053,"municipality":"SAN LEONARDO","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.43110245,"lng":120.9879911,"municipality":"SANTA ROSA","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.62002242,"lng":120.8803867,"municipality":"SANTO DOMINGO","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.72902656,"lng":120.8944763,"municipality":"SCIENCE CITY OF MUNOZ","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.61404135,"lng":120.934501,"municipality":"TALAVERA","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.76387178,"lng":120.809461,"municipality":"TALUGTUG","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.45336296,"lng":120.7881309,"municipality":"ZARAGOZA","province":"NUEVA ECIJA","region":"3"},
  {"lat":15.14555779,"lng":120.5862479,"municipality":"ANGELES","province":"PAMPANGA","region":"3"},
  {"lat":14.94825501,"lng":120.8038275,"municipality":"APALIT","province":"PAMPANGA","region":"3"},
  {"lat":15.17564973,"lng":120.778505,"municipality":"ARAYAT","province":"PAMPANGA","region":"3"},
  {"lat":15.03215469,"lng":120.6564937,"municipality":"BACOLOR","province":"PAMPANGA","region":"3"},
  {"lat":15.10154843,"lng":120.9050028,"municipality":"CANDABA","province":"PAMPANGA","region":"3"},
  {"lat":14.98771277,"lng":120.4868625,"municipality":"FLORIDABLANCA","province":"PAMPANGA","region":"3"},
  {"lat":14.96798442,"lng":120.6312414,"municipality":"GUAGUA","province":"PAMPANGA","region":"3"},
  {"lat":14.88929188,"lng":120.5737116,"municipality":"LUBAO","province":"PAMPANGA","region":"3"},
  {"lat":15.18779365,"lng":120.5157677,"municipality":"MABALACAT","province":"PAMPANGA","region":"3"},
  {"lat":14.89843521,"lng":120.7143286,"municipality":"MACABEBE","province":"PAMPANGA","region":"3"},
  {"lat":15.23128336,"lng":120.6927471,"municipality":"MAGALANG","province":"PAMPANGA","region":"3"},
  {"lat":14.83359519,"lng":120.6811891,"municipality":"MASANTOL","province":"PAMPANGA","region":"3"},
  {"lat":15.10408591,"lng":120.7160369,"municipality":"MEXICO","province":"PAMPANGA","region":"3"},
  {"lat":14.95298406,"lng":120.720028,"municipality":"MINALIN","province":"PAMPANGA","region":"3"},
  {"lat":15.08353742,"lng":120.5164548,"municipality":"PORAC","province":"PAMPANGA","region":"3"},
  {"lat":15.06107844,"lng":120.6886886,"municipality":"SAN FERNANDO","province":"PAMPANGA","region":"3"},
  {"lat":15.02689255,"lng":120.8306344,"municipality":"SAN LUIS","province":"PAMPANGA","region":"3"},
  {"lat":14.99300571,"lng":120.8111983,"municipality":"SAN SIMON","province":"PAMPANGA","region":"3"},
  {"lat":15.09958823,"lng":120.7933023,"municipality":"SANTA ANA","province":"PAMPANGA","region":"3"},
  {"lat":15.01019115,"lng":120.61493,"municipality":"SANTA RITA","province":"PAMPANGA","region":"3"},
  {"lat":14.99156257,"lng":120.7418313,"municipality":"SANTO TOMAS","province":"PAMPANGA","region":"3"},
  {"lat":14.87992155,"lng":120.6413488,"municipality":"SASMUAN","province":"PAMPANGA","region":"3"},
  {"lat":15.74221177,"lng":120.6142887,"municipality":"ANAO","province":"TARLAC","region":"3"},
  {"lat":15.24317705,"lng":120.4727358,"municipality":"BAMBAN","province":"TARLAC","region":"3"},
  {"lat":15.69337023,"lng":120.4182826,"municipality":"CAMILING","province":"TARLAC","region":"3"},
  {"lat":15.33041482,"lng":120.4430003,"municipality":"CAPAS","province":"TARLAC","region":"3"},
  {"lat":15.33054813,"lng":120.6784419,"municipality":"CONCEPCION","province":"TARLAC","region":"3"},
  {"lat":15.60100151,"lng":120.5655666,"municipality":"GERONA","province":"TARLAC","region":"3"},
  {"lat":15.4468625,"lng":120.7146733,"municipality":"LA PAZ","province":"TARLAC","region":"3"},
  {"lat":15.55968454,"lng":120.3084767,"municipality":"MAYANTOC","province":"TARLAC","region":"3"},
  {"lat":15.74456417,"lng":120.5533827,"municipality":"MONCADA","province":"TARLAC","region":"3"},
  {"lat":15.67237175,"lng":120.5405517,"municipality":"PANIQUI","province":"TARLAC","region":"3"},
  {"lat":15.62826409,"lng":120.645775,"municipality":"PURA","province":"TARLAC","region":"3"},
  {"lat":15.67907944,"lng":120.6264232,"municipality":"RAMOS","province":"TARLAC","region":"3"},
  {"lat":15.66677251,"lng":120.3329347,"municipality":"SAN CLEMENTE","province":"TARLAC","region":"3"},
  {"lat":15.43727686,"lng":120.3408073,"municipality":"SAN JOSE","province":"TARLAC","region":"3"},
  {"lat":15.82881829,"lng":120.5973961,"municipality":"SAN MANUEL","province":"TARLAC","region":"3"},
  {"lat":15.5826371,"lng":120.4471134,"municipality":"SANTA IGNACIA","province":"TARLAC","region":"3"},
  {"lat":15.48442102,"lng":120.6018319,"municipality":"TARLAC CITY","province":"TARLAC","region":"3"},
  {"lat":15.57574953,"lng":120.6857503,"municipality":"VICTORIA","province":"TARLAC","region":"3"},
  {"lat":15.22973234,"lng":120.200105,"municipality":"BOTOLAN","province":"ZAMBALES","region":"3"},
  {"lat":15.16111752,"lng":120.122893,"municipality":"CABANGAN","province":"ZAMBALES","region":"3"},
  {"lat":15.63769435,"lng":120.08341,"municipality":"CANDELARIA","province":"ZAMBALES","region":"3"},
  {"lat":14.9419445,"lng":120.2177063,"municipality":"CASTILLEJOS","province":"ZAMBALES","region":"3"},
  {"lat":15.37630727,"lng":120.0501732,"municipality":"IBA","province":"ZAMBALES","region":"3"},
  {"lat":15.51228046,"lng":119.9213791,"municipality":"MASINLOC","province":"ZAMBALES","region":"3"},
  {"lat":14.88623081,"lng":120.3426312,"municipality":"OLANGAPO CITY","province":"ZAMBALES","region":"3"},
  {"lat":15.45215766,"lng":120.0418605,"municipality":"PALAUIG","province":"ZAMBALES","region":"3"},
  {"lat":14.84672,"lng":120.082489,"municipality":"SAN ANTONIO","province":"ZAMBALES","region":"3"},
  {"lat":15.07384569,"lng":120.1261061,"municipality":"SAN FELIPE","province":"ZAMBALES","region":"3"},
  {"lat":15.02710152,"lng":120.2823492,"municipality":"SAN MARCELINO","province":"ZAMBALES","region":"3"},
  {"lat":15.01219079,"lng":120.1117232,"municipality":"SAN NARCISO","province":"ZAMBALES","region":"3"},
  {"lat":15.7858696,"lng":119.7886124,"municipality":"SANTA CRUZ","province":"ZAMBALES","region":"3"},
  {"lat":14.89513873,"lng":120.2628631,"municipality":"SUBIC","province":"ZAMBALES","region":"3"},
  {"lat":13.28171,"lng":123.848686,"municipality":"BACACAY","province":"ALBAY","region":"5"},
  {"lat":13.14185059,"lng":123.6376181,"municipality":"CAMALIG","province":"ALBAY","region":"5"},
  {"lat":13.11152992,"lng":123.6901201,"municipality":"DARAGA","province":"ALBAY","region":"5"},
  {"lat":13.17463251,"lng":123.57564,"municipality":"GUINOBATAN","province":"ALBAY","region":"5"},
  {"lat":13.04978945,"lng":123.5793918,"municipality":"JOVELLAR","province":"ALBAY","region":"5"},
  {"lat":13.10004961,"lng":123.7542859,"municipality":"LEGAZPI CITY","province":"ALBAY","region":"5"},
  {"lat":13.24707927,"lng":123.3705704,"municipality":"LIBON","province":"ALBAY","region":"5"},
  {"lat":13.18230598,"lng":123.4944229,"municipality":"LIGAO CITY","province":"ALBAY","region":"5"},
  {"lat":13.30542196,"lng":123.7343885,"municipality":"MALILIPOT","province":"ALBAY","region":"5"},
  {"lat":13.38457469,"lng":123.6522757,"municipality":"MALINAO","province":"ALBAY","region":"5"},
  {"lat":13.08632627,"lng":123.878053,"municipality":"MANITO","province":"ALBAY","region":"5"},
  {"lat":13.16778569,"lng":123.4034133,"municipality":"OAS","province":"ALBAY","region":"5"},
  {"lat":13.06251793,"lng":123.4679557,"municipality":"PIO DURAN","province":"ALBAY","region":"5"},
  {"lat":13.33267822,"lng":123.505194,"municipality":"POLANGUI","province":"ALBAY","region":"5"},
  {"lat":13.26344967,"lng":124.0377808,"municipality":"RAPU RAPU","province":"ALBAY","region":"5"},
  {"lat":13.24825882,"lng":123.7546744,"municipality":"SANTO DOMINGO","province":"ALBAY","region":"5"},
  {"lat":13.33522615,"lng":123.6965702,"municipality":"TABACO CITY","province":"ALBAY","region":"5"},
  {"lat":13.46293203,"lng":123.6156309,"municipality":"TIWI","province":"ALBAY","region":"5"},
  {"lat":13.99330241,"lng":122.9786156,"municipality":"BASUD","province":"CAMARINES NORTE","region":"5"},
  {"lat":14.34872,"lng":122.522652,"municipality":"CAPALONGA","province":"CAMARINES NORTE","region":"5"},
  {"lat":14.1098505,"lng":122.9501139,"municipality":"DAET","province":"CAMARINES NORTE","region":"5"},
  {"lat":14.31861,"lng":122.673119,"municipality":"JOSE PANGANIBAN","province":"CAMARINES NORTE","region":"5"},
  {"lat":14.13413851,"lng":122.684156,"municipality":"LABO","province":"CAMARINES NORTE","region":"5"},
  {"lat":14.10444,"lng":123.030563,"municipality":"MERCEDES","province":"CAMARINES NORTE","region":"5"},
  {"lat":14.25125937,"lng":122.7885446,"municipality":"PARACALE","province":"CAMARINES NORTE","region":"5"},
  {"lat":14.01403326,"lng":122.8824733,"municipality":"SAN LORENZO RUIZ","province":"CAMARINES NORTE","region":"5"},
  {"lat":14.07849674,"lng":122.8599362,"municipality":"SAN VICENTE","province":"CAMARINES NORTE","region":"5"},
  {"lat":14.18269,"lng":122.344917,"municipality":"SANTA ELENA","province":"CAMARINES NORTE","region":"5"},
  {"lat":14.14286209,"lng":122.9243845,"municipality":"TALISAY CITY","province":"CAMARINES NORTE","region":"5"},
  {"lat":14.37173,"lng":122.96273,"municipality":"VINZONS","province":"CAMARINES NORTE","region":"5"},
  {"lat":13.48293784,"lng":123.3663857,"municipality":"BAAO","province":"CAMARINES SUR","region":"5"},
  {"lat":13.3500846,"lng":123.251357,"municipality":"BALATAN","province":"CAMARINES SUR","region":"5"},
  {"lat":13.31841341,"lng":123.3136315,"municipality":"BATO","province":"CAMARINES SUR","region":"5"},
  {"lat":13.68352046,"lng":123.2043658,"municipality":"BOMBON","province":"CAMARINES SUR","region":"5"},
  {"lat":13.43719433,"lng":123.5145506,"municipality":"BUHI","province":"CAMARINES SUR","region":"5"},
  {"lat":13.45630198,"lng":123.2623035,"municipality":"BULA","province":"CAMARINES SUR","region":"5"},
  {"lat":13.74254659,"lng":123.0708596,"municipality":"CABUSAO","province":"CAMARINES SUR","region":"5"},
  {"lat":13.71032044,"lng":123.2710906,"municipality":"CALABANGA","province":"CAMARINES SUR","region":"5"},
  {"lat":13.62549089,"lng":123.1626752,"municipality":"CAMALIGAN","province":"CAMARINES SUR","region":"5"},
  {"lat":13.64275775,"lng":123.1301314,"municipality":"CANAMAN","province":"CAMARINES SUR","region":"5"},
  {"lat":13.74833012,"lng":123.9683228,"municipality":"CARAMOAN","province":"CAMARINES SUR","region":"5"},
  {"lat":13.94605734,"lng":122.7084969,"municipality":"DEL GALLEGO","province":"CAMARINES SUR","region":"5"},
  {"lat":13.60839404,"lng":123.1330905,"municipality":"GAINZA","province":"CAMARINES SUR","region":"5"},
  {"lat":13.88858032,"lng":123.7386475,"municipality":"GARCHITORENA","province":"CAMARINES SUR","region":"5"},
  {"lat":13.73129992,"lng":123.4245538,"municipality":"GOA","province":"CAMARINES SUR","region":"5"},
  {"lat":13.44838237,"lng":123.4332975,"municipality":"IRIGA CITY","province":"CAMARINES SUR","region":"5"},
  {"lat":13.92775,"lng":123.546661,"municipality":"LAGONOY","province":"CAMARINES SUR","region":"5"},
  {"lat":13.66597378,"lng":122.9742783,"municipality":"LIBMANAN","province":"CAMARINES SUR","region":"5"},
  {"lat":13.84807,"lng":122.8879504,"municipality":"LUPI","province":"CAMARINES SUR","region":"5"},
  {"lat":13.66955228,"lng":123.1548108,"municipality":"MAGARAO","province":"CAMARINES SUR","region":"5"},
  {"lat":13.59193626,"lng":123.1727242,"municipality":"MILAOR","province":"CAMARINES SUR","region":"5"},
  {"lat":13.51569024,"lng":123.1952439,"municipality":"MINALABAC","province":"CAMARINES SUR","region":"5"},
  {"lat":13.3927955,"lng":123.3385469,"municipality":"NABUA","province":"CAMARINES SUR","region":"5"},
  {"lat":13.64368803,"lng":123.2594656,"municipality":"NAGA CITY","province":"CAMARINES SUR","region":"5"},
  {"lat":13.58160892,"lng":123.3824886,"municipality":"OCAMPO","province":"CAMARINES SUR","region":"5"},
  {"lat":13.59262397,"lng":123.0698684,"municipality":"PAMPLONA","province":"CAMARINES SUR","region":"5"},
  {"lat":13.55141314,"lng":122.9989122,"municipality":"PASACAO","province":"CAMARINES SUR","region":"5"},
  {"lat":13.58830225,"lng":123.2897623,"municipality":"PILI","province":"CAMARINES SUR","region":"5"},
  {"lat":13.74508632,"lng":123.7264017,"municipality":"PRESENTACION","province":"CAMARINES SUR","region":"5"},
  {"lat":13.86077976,"lng":122.6493225,"municipality":"RAGAY","province":"CAMARINES SUR","region":"5"},
  {"lat":13.55924126,"lng":123.5162652,"municipality":"SAGAY CITY","province":"CAMARINES SUR","region":"5"},
  {"lat":13.52453684,"lng":123.1264668,"municipality":"SAN FERNANDO","province":"CAMARINES SUR","region":"5"},
  {"lat":13.69228133,"lng":123.5332944,"municipality":"SAN JOSE","province":"CAMARINES SUR","region":"5"},
  {"lat":13.79843456,"lng":122.965528,"municipality":"SIPOCOT","province":"CAMARINES SUR","region":"5"},
  {"lat":14.06478024,"lng":123.2632828,"municipality":"SIRUMA","province":"CAMARINES SUR","region":"5"},
  {"lat":13.628583,"lng":123.4715546,"municipality":"TIGAON","province":"CAMARINES SUR","region":"5"},
  {"lat":13.95334,"lng":123.321411,"municipality":"TINAMBAC","province":"CAMARINES SUR","region":"5"},
  {"lat":13.95138326,"lng":124.2574498,"municipality":"BAGAMANOC","province":"CATANDUANES","region":"5"},
  {"lat":13.69355498,"lng":124.3639758,"municipality":"BARAS","province":"CATANDUANES","region":"5"},
  {"lat":13.60085951,"lng":124.3134228,"municipality":"BATO","province":"CATANDUANES","region":"5"},
  {"lat":13.84947688,"lng":124.1792788,"municipality":"CARAMOAN","province":"CATANDUANES","region":"5"},
  {"lat":13.78571842,"lng":124.3549678,"municipality":"GIGMOTO","province":"CATANDUANES","region":"5"},
  {"lat":14.01972,"lng":124.049721,"municipality":"PANDAN","province":"CATANDUANES","region":"5"},
  {"lat":13.89795076,"lng":124.2757261,"municipality":"PANGANIBAN","province":"CATANDUANES","region":"5"},
  {"lat":13.60315037,"lng":124.1538773,"municipality":"SAN ANDRES","province":"CATANDUANES","region":"5"},
  {"lat":13.6985498,"lng":124.2730162,"municipality":"SAN MIGUEL","province":"CATANDUANES","region":"5"},
  {"lat":13.84716894,"lng":124.3092451,"municipality":"VIGA","province":"CATANDUANES","region":"5"},
  {"lat":13.61574196,"lng":124.1967634,"municipality":"VIRAC","province":"CATANDUANES","region":"5"},
  {"lat":12.58749962,"lng":123.2680588,"municipality":"AROROY","province":"MASBATE","region":"5"},
  {"lat":12.41189549,"lng":123.4721127,"municipality":"BALENO","province":"MASBATE","region":"5"},
  {"lat":12.07528019,"lng":123.3183365,"municipality":"BALUD","province":"MASBATE","region":"5"},
  {"lat":12.40445847,"lng":123.7621591,"municipality":"BATUAN","province":"MASBATE","region":"5"},
  {"lat":11.99930929,"lng":123.9620196,"municipality":"CATAINGAN","province":"MASBATE","region":"5"},
  {"lat":11.93000031,"lng":123.7288895,"municipality":"CAWAYAN","province":"MASBATE","region":"5"},
  {"lat":12.89861012,"lng":123.2597198,"municipality":"CLAVERIA","province":"MASBATE","region":"5"},
  {"lat":12.15738125,"lng":123.8399192,"municipality":"DIMASALANG","province":"MASBATE","region":"5"},
  {"lat":11.81029225,"lng":124.0066438,"municipality":"ESPERANZA","province":"MASBATE","region":"5"},
  {"lat":12.24193954,"lng":123.2525024,"municipality":"MANDAON","province":"MASBATE","region":"5"},
  {"lat":12.33790694,"lng":123.5653434,"municipality":"MASBATE CITY","province":"MASBATE","region":"5"},
  {"lat":12.16806,"lng":123.408333,"municipality":"MILAGROS","province":"MASBATE","region":"5"},
  {"lat":12.27758251,"lng":123.6648477,"municipality":"MOBO","province":"MASBATE","region":"5"},
  {"lat":12.60056,"lng":123.609734,"municipality":"MONREAL","province":"MASBATE","region":"5"},
  {"lat":12.0987683,"lng":123.890745,"municipality":"PALANAS","province":"MASBATE","region":"5"},
  {"lat":11.85082693,"lng":124.033909,"municipality":"PIO V CORPUZ","province":"MASBATE","region":"5"},
  {"lat":11.94875062,"lng":123.8754656,"municipality":"PLACER","province":"MASBATE","region":"5"},
  {"lat":12.47962376,"lng":123.7290327,"municipality":"SAN FERNANDO","province":"MASBATE","region":"5"},
  {"lat":12.55326114,"lng":123.6894359,"municipality":"SAN JACINTO","province":"MASBATE","region":"5"},
  {"lat":13.13621044,"lng":123.0173721,"municipality":"SAN PASCUAL","province":"MASBATE","region":"5"},
  {"lat":12.18512599,"lng":123.7513767,"municipality":"USON","province":"MASBATE","region":"5"},
  {"lat":12.83793733,"lng":124.1162447,"municipality":"BARCELONA","province":"SORSOGON","region":"5"},
  {"lat":12.68134622,"lng":123.925345,"municipality":"BULAN","province":"SORSOGON","region":"5"},
  {"lat":12.75962872,"lng":124.1053736,"municipality":"BULUSAN","province":"SORSOGON","region":"5"},
  {"lat":12.85995307,"lng":124.0429208,"municipality":"CASIGURAN","province":"SORSOGON","region":"5"},
  {"lat":12.88193989,"lng":123.7672195,"municipality":"CASTILLA","province":"SORSOGON","region":"5"},
  {"lat":12.97106248,"lng":123.576106,"municipality":"DONSOL","province":"SORSOGON","region":"5"},
  {"lat":12.92687332,"lng":124.1075865,"municipality":"GUBAT","province":"SORSOGON","region":"5"},
  {"lat":12.71458793,"lng":124.0300037,"municipality":"IROSIN","province":"SORSOGON","region":"5"},
  {"lat":12.811332,"lng":123.9729921,"municipality":"JUBAN","province":"SORSOGON","region":"5"},
  {"lat":12.83528042,"lng":123.7908325,"municipality":"MAGALLANES","province":"SORSOGON","region":"5"},
  {"lat":12.55022,"lng":124.106232,"municipality":"MATNOG","province":"SORSOGON","region":"5"},
  {"lat":12.89583016,"lng":123.6936111,"municipality":"PILAR","province":"SORSOGON","region":"5"},
  {"lat":13.03670232,"lng":124.1631673,"municipality":"PRIETO DIAZ","province":"SORSOGON","region":"5"},
  {"lat":12.65601857,"lng":124.0876284,"municipality":"SANTA MAGDALENA","province":"SORSOGON","region":"5"},
  {"lat":13.03353977,"lng":124.1037292,"municipality":"SORSOGON CITY","province":"SORSOGON","region":"5"},
  {"lat":11.6388442,"lng":124.4129431,"municipality":"ALMERIA","province":"BILIRAN","region":"8"},
  {"lat":11.51228313,"lng":124.4826436,"municipality":"BILIRAN","province":"BILIRAN","region":"8"},
  {"lat":11.50076426,"lng":124.5634792,"municipality":"CABUCGAYAN","province":"BILIRAN","region":"8"},
  {"lat":11.56003015,"lng":124.5529191,"municipality":"CAIBIRAN","province":"BILIRAN","region":"8"},
  {"lat":11.64218257,"lng":124.5072871,"municipality":"CULABA","province":"BILIRAN","region":"8"},
  {"lat":11.68272401,"lng":124.4046207,"municipality":"KAWAYAN","province":"BILIRAN","region":"8"},
  {"lat":11.78876041,"lng":124.322902,"municipality":"MARIPIPI","province":"BILIRAN","region":"8"},
  {"lat":11.57694829,"lng":124.435806,"municipality":"NAVAL","province":"BILIRAN","region":"8"},
  {"lat":12.23452692,"lng":125.3261567,"municipality":"ARTECHE","province":"EASTERN SAMAR","region":"8"},
  {"lat":11.20165641,"lng":125.3638907,"municipality":"BALANGIGA","province":"EASTERN SAMAR","region":"8"},
  {"lat":11.40920174,"lng":125.405224,"municipality":"BALANGKAYAN","province":"EASTERN SAMAR","region":"8"},
  {"lat":11.59504223,"lng":125.4968796,"municipality":"BORONGAN CITY","province":"EASTERN SAMAR","region":"8"},
  {"lat":11.98777799,"lng":125.3298338,"municipality":"CAN AVID","province":"EASTERN SAMAR","region":"8"},
  {"lat":12.07823921,"lng":125.3350949,"municipality":"DOLORES","province":"EASTERN SAMAR","region":"8"},
  {"lat":11.26741581,"lng":125.5071723,"municipality":"GENERAL MACARTHUR","province":"EASTERN SAMAR","region":"8"},
  {"lat":11.1270543,"lng":125.474665,"municipality":"GIPORLOS","province":"EASTERN SAMAR","region":"8"},
  {"lat":10.76527977,"lng":125.7122192,"municipality":"GUIUAN","province":"EASTERN SAMAR","region":"8"},
  {"lat":11.3266805,"lng":125.5923627,"municipality":"HERNANI","province":"EASTERN SAMAR","region":"8"},
  {"lat":12.27824586,"lng":125.2039079,"municipality":"JIPAPAD","province":"EASTERN SAMAR","region":"8"},
  {"lat":11.20207224,"lng":125.2867638,"municipality":"LAWAAN","province":"EASTERN SAMAR","region":"8"},
  {"lat":11.34276708,"lng":125.4475923,"municipality":"LLORENTE","province":"EASTERN SAMAR","region":"8"},
  {"lat":12.10712772,"lng":125.175166,"municipality":"MASLOG","province":"EASTERN SAMAR","region":"8"},
  {"lat":11.46029763,"lng":125.3609603,"municipality":"MAYDOLONG","province":"EASTERN SAMAR","region":"8"},
  {"lat":11.0890219,"lng":125.7053631,"municipality":"MERCEDES","province":"EASTERN SAMAR","region":"8"},
  {"lat":12.15269209,"lng":125.3863279,"municipality":"ORAS","province":"EASTERN SAMAR","region":"8"},
  {"lat":11.18957201,"lng":125.4765036,"municipality":"QUINAPONDAN","province":"EASTERN SAMAR","region":"8"},
  {"lat":11.17860985,"lng":125.6766663,"municipality":"SALCEDO","province":"EASTERN SAMAR","region":"8"},
  {"lat":11.73132558,"lng":125.3721046,"municipality":"SAN JULIAN","province":"EASTERN SAMAR","region":"8"},
  {"lat":12.20729289,"lng":125.4544077,"municipality":"SAN POLICARPO","province":"EASTERN SAMAR","region":"8"},
  {"lat":11.79565717,"lng":125.3736783,"municipality":"SULAT","province":"EASTERN SAMAR","region":"8"},
  {"lat":11.87767848,"lng":125.3402155,"municipality":"TAFT","province":"EASTERN SAMAR","region":"8"},
  {"lat":10.65844544,"lng":125.0448216,"municipality":"ABUYOG","province":"LEYTE","region":"8"},
  {"lat":11.22002673,"lng":124.8642172,"municipality":"ALANGALANG","province":"LEYTE","region":"8"},
  {"lat":10.92581989,"lng":124.745502,"municipality":"ALBUERA","province":"LEYTE","region":"8"},
  {"lat":11.4158802,"lng":124.9529037,"municipality":"BABATNGON","province":"LEYTE","region":"8"},
  {"lat":11.3078434,"lng":124.7690256,"municipality":"BARUGO","province":"LEYTE","region":"8"},
  {"lat":10.33207095,"lng":124.8393178,"municipality":"BATO","province":"LEYTE","region":"8"},
  {"lat":10.6885704,"lng":124.8380221,"municipality":"BAYBAY","province":"LEYTE","region":"8"},
  {"lat":10.9638894,"lng":124.8549946,"municipality":"BURAUEN","province":"LEYTE","region":"8"},
  {"lat":11.48433811,"lng":124.3639316,"municipality":"CALUBIAN","province":"LEYTE","region":"8"},
  {"lat":11.25007374,"lng":124.6042119,"municipality":"CAPOOCAN","province":"LEYTE","region":"8"},
  {"lat":11.23680085,"lng":124.6931031,"municipality":"CARIGARA","province":"LEYTE","region":"8"},
  {"lat":11.06136319,"lng":124.8627273,"municipality":"DAGAMI","province":"LEYTE","region":"8"},
  {"lat":10.96327875,"lng":125.0084769,"municipality":"DULAG","province":"LEYTE","region":"8"},
  {"lat":10.39594016,"lng":124.8230322,"municipality":"HILONGOS","province":"LEYTE","region":"8"},
  {"lat":10.45543333,"lng":124.8132346,"municipality":"HINDANG","province":"LEYTE","region":"8"},
  {"lat":10.51964398,"lng":124.8421636,"municipality":"INOPACAN","province":"LEYTE","region":"8"},
  {"lat":10.94030031,"lng":124.4596946,"municipality":"ISABELA","province":"LEYTE","region":"8"},
  {"lat":11.16200304,"lng":124.7655528,"municipality":"JARO","province":"LEYTE","region":"8"},
  {"lat":10.76395804,"lng":124.9247012,"municipality":"JAVIER","province":"LEYTE","region":"8"},
  {"lat":10.98130368,"lng":124.9613043,"municipality":"JULITA","province":"LEYTE","region":"8"},
  {"lat":11.16896895,"lng":124.5640101,"municipality":"KANANGA","province":"LEYTE","region":"8"},
  {"lat":10.88075147,"lng":124.9027871,"municipality":"LA PAZ","province":"LEYTE","region":"8"},
  {"lat":11.34941959,"lng":124.550911,"municipality":"LEYTE","province":"LEYTE","region":"8"},
  {"lat":10.82480246,"lng":124.938072,"municipality":"MACARTHUR","province":"LEYTE","region":"8"},
  {"lat":10.59096582,"lng":124.9867553,"municipality":"MAHAPLAG","province":"LEYTE","region":"8"},
  {"lat":11.12402287,"lng":124.4682623,"municipality":"MATAG OB","province":"LEYTE","region":"8"},
  {"lat":10.26514529,"lng":124.8247187,"municipality":"MATALOM","province":"LEYTE","region":"8"},
  {"lat":10.88315162,"lng":124.9877545,"municipality":"MAYORGA","province":"LEYTE","region":"8"},
  {"lat":10.96365013,"lng":124.5102472,"municipality":"MERIDA","province":"LEYTE","region":"8"},
  {"lat":11.05524611,"lng":124.635705,"municipality":"ORMOC CITY","province":"LEYTE","region":"8"},
  {"lat":11.14566067,"lng":124.9697755,"municipality":"PALO","province":"LEYTE","region":"8"},
  {"lat":11.01139,"lng":124.384163,"municipality":"PALOMPON","province":"LEYTE","region":"8"},
  {"lat":11.42454827,"lng":124.3563605,"municipality":"SAN ISIDRO","province":"LEYTE","region":"8"},
  {"lat":11.3184053,"lng":124.8436997,"municipality":"SAN MIGUEL","province":"LEYTE","region":"8"},
  {"lat":11.1886597,"lng":124.9361688,"municipality":"SANTA FE","province":"LEYTE","region":"8"},
  {"lat":11.30926782,"lng":124.4039602,"municipality":"TABANGO","province":"LEYTE","region":"8"},
  {"lat":11.04415046,"lng":124.9470874,"municipality":"TABONTABON","province":"LEYTE","region":"8"},
  {"lat":11.2723541,"lng":124.9552212,"municipality":"TACLOBAN CITY","province":"LEYTE","region":"8"},
  {"lat":11.084632,"lng":124.9907461,"municipality":"TANAUAN","province":"LEYTE","region":"8"},
  {"lat":11.03687992,"lng":125.0202852,"municipality":"TOLOSA","province":"LEYTE","region":"8"},
  {"lat":11.24754783,"lng":124.7569914,"municipality":"TUNGA","province":"LEYTE","region":"8"},
  {"lat":11.19565336,"lng":124.4346822,"municipality":"VILLABA","province":"LEYTE","region":"8"},
  {"lat":12.50479421,"lng":124.3139482,"municipality":"ALLEN","province":"NORTHERN SAMAR","region":"8"},
  {"lat":12.61679,"lng":124.43203,"municipality":"BIRI","province":"NORTHERN SAMAR","region":"8"},
  {"lat":12.41088357,"lng":124.5363787,"municipality":"BOMBON","province":"NORTHERN SAMAR","region":"8"},
  {"lat":12.42815236,"lng":124.1623481,"municipality":"CAPUL","province":"NORTHERN SAMAR","region":"8"},
  {"lat":12.42896815,"lng":124.6377204,"municipality":"CATARMAN","province":"NORTHERN SAMAR","region":"8"},
  {"lat":12.40038396,"lng":125.0771226,"municipality":"CATUBIG","province":"NORTHERN SAMAR","region":"8"},
  {"lat":12.38997581,"lng":125.2584876,"municipality":"GAMAY","province":"NORTHERN SAMAR","region":"8"},
  {"lat":12.48324013,"lng":125.074852,"municipality":"LAOAG","province":"NORTHERN SAMAR","region":"8"},
  {"lat":12.3114646,"lng":125.2829409,"municipality":"LAPINIG","province":"NORTHERN SAMAR","region":"8"},
  {"lat":12.30234004,"lng":125.0265863,"municipality":"LAS NAVAS","province":"NORTHERN SAMAR","region":"8"},
  {"lat":12.58082962,"lng":124.3772202,"municipality":"LAVEZARES","province":"NORTHERN SAMAR","region":"8"},
  {"lat":12.32132269,"lng":124.6593165,"municipality":"LOPE DE VEGA","province":"NORTHERN SAMAR","region":"8"},
  {"lat":12.45071392,"lng":125.2078438,"municipality":"MAPANAS","province":"NORTHERN SAMAR","region":"8"},
  {"lat":12.411275,"lng":124.7761953,"municipality":"MONDRAGON","province":"NORTHERN SAMAR","region":"8"},
  {"lat":12.51910373,"lng":125.1368858,"municipality":"PALAPAG","province":"NORTHERN SAMAR","region":"8"},
  {"lat":12.45874012,"lng":124.9392293,"municipality":"PAMBUJAN","province":"NORTHERN SAMAR","region":"8"},
  {"lat":12.50131166,"lng":124.4369207,"municipality":"ROSARIO","province":"NORTHERN SAMAR","region":"8"},
  {"lat":12.41011583,"lng":124.2628488,"municipality":"SAN ANTONIO","province":"NORTHERN SAMAR","region":"8"},
  {"lat":12.34787443,"lng":124.39365,"municipality":"SAN ISIDRO","province":"NORTHERN SAMAR","region":"8"},
  {"lat":12.58128,"lng":124.481598,"municipality":"SAN JOSE","province":"NORTHERN SAMAR","region":"8"},
  {"lat":12.46227062,"lng":124.876893,"municipality":"SAN ROQUE","province":"NORTHERN SAMAR","region":"8"},
  {"lat":12.39694,"lng":124.02417,"municipality":"SAN VICENTE","province":"NORTHERN SAMAR","region":"8"},
  {"lat":12.28128926,"lng":124.8647423,"municipality":"SILVINO LOBOS","province":"NORTHERN SAMAR","region":"8"},
  {"lat":12.42654297,"lng":124.4043923,"municipality":"VICTORIAS CITY","province":"NORTHERN SAMAR","region":"8"},
  {"lat":11.92781806,"lng":124.3113261,"municipality":"ALMAGRO","province":"SAMAR","region":"8"},
  {"lat":11.39366914,"lng":125.1520239,"municipality":"BASEY","province":"SAMAR","region":"8"},
  {"lat":12.19266789,"lng":124.5886178,"municipality":"CALBAYOG","province":"SAMAR","region":"8"},
  {"lat":11.61967918,"lng":125.0867075,"municipality":"CALBIGA","province":"SAMAR","region":"8"},
  {"lat":11.82814,"lng":124.70359,"municipality":"CATBALOGAN","province":"SAMAR","region":"8"},
  {"lat":11.68626976,"lng":124.7544403,"municipality":"DARAM","province":"SAMAR","region":"8"},
  {"lat":12.0705958,"lng":124.823489,"municipality":"GANDARA","province":"SAMAR","region":"8"},
  {"lat":11.72288206,"lng":125.1793933,"municipality":"HINABANGAN","province":"SAMAR","region":"8"},
  {"lat":11.8476957,"lng":124.966343,"municipality":"JIABONG","province":"SAMAR","region":"8"},
  {"lat":11.20584725,"lng":125.2184589,"municipality":"MARABUT","province":"SAMAR","region":"8"},
  {"lat":12.19367455,"lng":125.0071034,"municipality":"MATUGUINAO","province":"SAMAR","region":"8"},
  {"lat":11.8805993,"lng":125.0162699,"municipality":"MOTIONG","province":"SAMAR","region":"8"},
  {"lat":11.96546546,"lng":124.755251,"municipality":"PAGSANGHAN","province":"SAMAR","region":"8"},
  {"lat":11.87305151,"lng":125.1307326,"municipality":"PARANAS","province":"SAMAR","region":"8"},
  {"lat":11.55829164,"lng":125.0796205,"municipality":"PINABACDAO","province":"SAMAR","region":"8"},
  {"lat":11.98316506,"lng":124.9037243,"municipality":"SAN JORGE","province":"SAMAR","region":"8"},
  {"lat":12.06576998,"lng":125.0454123,"municipality":"SAN JOSE DE BUAN","province":"SAMAR","region":"8"},
  {"lat":11.69969508,"lng":125.0215306,"municipality":"SAN SEBASTIAN","province":"SAMAR","region":"8"},
  {"lat":12.06182735,"lng":124.7145217,"municipality":"SANTA MARGARITA","province":"SAMAR","region":"8"},
  {"lat":11.42479,"lng":124.994263,"municipality":"SANTA RITA","province":"SAMAR","region":"8"},
  {"lat":11.92608227,"lng":124.4345994,"municipality":"SANTO NINO","province":"SAMAR","region":"8"},
  {"lat":12.06195936,"lng":124.1900572,"municipality":"TAGAPUL AN","province":"SAMAR","region":"8"},
  {"lat":11.50994573,"lng":124.8469171,"municipality":"TALALORA","province":"SAMAR","region":"8"},
  {"lat":11.86997986,"lng":124.7890396,"municipality":"TARANGNAN","province":"SAMAR","region":"8"},
  {"lat":11.59237003,"lng":124.878952,"municipality":"VILLAREAL","province":"SAMAR","region":"8"},
  {"lat":11.61949,"lng":124.861343,"municipality":"ZUMARRAGA","province":"SAMAR","region":"8"},
  {"lat":10.29862653,"lng":125.2150544,"municipality":"ANAHAWAN","province":"SOUTHERN LEYTE","region":"8"},
  {"lat":10.37131881,"lng":124.9278888,"municipality":"BONTOC","province":"SOUTHERN LEYTE","region":"8"},
  {"lat":10.39685295,"lng":125.145552,"municipality":"HINUNANGAN","province":"SOUTHERN LEYTE","region":"8"},
  {"lat":10.344313,"lng":125.2294382,"municipality":"HINUNDAYAN","province":"SOUTHERN LEYTE","region":"8"},
  {"lat":10.33158299,"lng":125.0682963,"municipality":"LIBAGON","province":"SOUTHERN LEYTE","region":"8"},
  {"lat":10.13300569,"lng":125.1636203,"municipality":"LILOAN","province":"SOUTHERN LEYTE","region":"8"},
  {"lat":9.930554385,"lng":125.0716043,"municipality":"LIMASAWA","province":"SOUTHERN LEYTE","region":"8"},
  {"lat":10.18448265,"lng":124.8534636,"municipality":"MAASIN","province":"SOUTHERN LEYTE","region":"8"},
  {"lat":10.09228986,"lng":124.9490387,"municipality":"MACROHON","province":"SOUTHERN LEYTE","region":"8"},
  {"lat":10.17867245,"lng":124.9604715,"municipality":"MALITBOG","province":"SOUTHERN LEYTE","region":"8"},
  {"lat":10.07926902,"lng":125.0000048,"municipality":"PADRE BURGOS","province":"SOUTHERN LEYTE","region":"8"},
  {"lat":9.975881429,"lng":125.2410809,"municipality":"PINTUYAN","province":"SOUTHERN LEYTE","region":"8"},
  {"lat":10.30601906,"lng":125.1213283,"municipality":"SAINT BERNARD","province":"SOUTHERN LEYTE","region":"8"},
  {"lat":10.07279831,"lng":125.165588,"municipality":"SAN FRANCISCO","province":"SOUTHERN LEYTE","region":"8"},
  {"lat":10.27189832,"lng":125.1939954,"municipality":"SAN JUAN","province":"SOUTHERN LEYTE","region":"8"},
  {"lat":9.989493169,"lng":125.2594727,"municipality":"SAN RICARDO","province":"SOUTHERN LEYTE","region":"8"},
  {"lat":10.52044248,"lng":125.1294409,"municipality":"SILAGO","province":"SOUTHERN LEYTE","region":"8"},
  {"lat":10.45652701,"lng":124.9979655,"municipality":"SOGOD","province":"SOUTHERN LEYTE","region":"8"},
  {"lat":10.27816944,"lng":124.9429165,"municipality":"TOMAS OPPUS","province":"SOUTHERN LEYTE","region":"8"},
];

// ─── Nearest Station Lookup (keyed by "lat,lng" rounded to 5 decimal places) ─
interface NearestStationInfo {
  nearest_station: string;
  distance_km: number;
  station_lat: number;
  station_lng: number;
}

const NEAREST_STATION_LOOKUP: Record<string, NearestStationInfo> = {"20.45842,121.99263":{"nearest_station":"Basco Radar","distance_km":2.5,"station_lat":20.451,"station_lng":121.97},"20.7576,121.83771":{"nearest_station":"Itbayat","distance_km":3.2,"station_lat":20.786,"station_lng":121.843},"20.37607,121.92679":{"nearest_station":"Basco Radar","distance_km":9.47,"station_lat":20.451,"station_lng":121.97},"20.41072,121.95115":{"nearest_station":"Basco Radar","distance_km":4.89,"station_lat":20.451,"station_lng":121.97},"20.311,121.85121":{"nearest_station":"Basco Radar","distance_km":19.89,"station_lat":20.451,"station_lng":121.97},"20.37478,121.95368":{"nearest_station":"Basco Radar","distance_km":8.64,"station_lat":20.451,"station_lng":121.97},"18.43969,121.44539":{"nearest_station":"Aparri","distance_km":22.69,"station_lat":18.355,"station_lng":121.641},"17.90757,121.66056":{"nearest_station":"Tuguegarao","distance_km":33.48,"station_lat":17.613,"station_lng":121.726},"18.22413,121.5501":{"nearest_station":"Aparri","distance_km":17.43,"station_lat":18.355,"station_lng":121.641},"17.82296,121.70449":{"nearest_station":"Tuguegarao","distance_km":23.46,"station_lat":17.613,"station_lng":121.726},"18.35384,121.64075":{"nearest_station":"Aparri","distance_km":0.13,"station_lat":18.355,"station_lng":121.641},"17.93237,121.77186":{"nearest_station":"Tuguegarao","distance_km":35.84,"station_lat":17.613,"station_lng":121.726},"18.36026,121.5071":{"nearest_station":"Aparri","distance_km":14.14,"station_lat":18.355,"station_lng":121.641},"18.2798,121.82683":{"nearest_station":"Aparri","distance_km":21.32,"station_lat":18.355,"station_lng":121.641},"19.25485,121.48624":{"nearest_station":"Calayan","distance_km":3.93,"station_lat":19.278,"station_lng":121.458},"18.27027,121.68575":{"nearest_station":"Aparri","distance_km":10.54,"station_lat":18.355,"station_lng":121.641},"18.56125,121.0975":{"nearest_station":"Aparri","distance_km":61.74,"station_lat":18.355,"station_lng":121.641},"17.55885,121.69387":{"nearest_station":"Tuguegarao","distance_km":6.92,"station_lat":17.613,"station_lng":121.726},"18.05815,121.85977":{"nearest_station":"Aparri","distance_km":40.29,"station_lat":18.355,"station_lng":121.641},"18.25541,122.12579":{"nearest_station":"Aparri","distance_km":52.36,"station_lat":18.355,"station_lng":121.641},"17.75347,121.74891":{"nearest_station":"Tuguegarao","distance_km":15.81,"station_lat":17.613,"station_lng":121.726},"18.16025,121.86277":{"nearest_station":"Aparri","distance_km":31.9,"station_lat":18.355,"station_lng":121.641},"18.05324,121.54255":{"nearest_station":"Aparri","distance_km":35.13,"station_lat":18.355,"station_lng":121.641},"18.44562,121.3262":{"nearest_station":"Aparri","distance_km":34.71,"station_lat":18.355,"station_lng":121.641},"17.67809,121.97572":{"nearest_station":"Tuguegarao","distance_km":27.43,"station_lat":17.613,"station_lng":121.726},"17.77225,121.53242":{"nearest_station":"Tuguegarao","distance_km":27.09,"station_lat":17.613,"station_lng":121.726},"17.83805,121.39363":{"nearest_station":"Tuguegarao","distance_km":43.19,"station_lat":17.613,"station_lng":121.726},"18.5214,121.20429":{"nearest_station":"Aparri","distance_km":49.64,"station_lat":18.355,"station_lng":121.641},"18.43626,122.25903":{"nearest_station":"Aparri","distance_km":65.83,"station_lat":18.355,"station_lng":121.641},"18.53152,120.99931":{"nearest_station":"Aparri","distance_km":70.48,"station_lat":18.355,"station_lng":121.641},"18.23518,121.90897":{"nearest_station":"Aparri","distance_km":31.27,"station_lat":18.355,"station_lng":121.641},"17.92192,121.50566":{"nearest_station":"Tuguegarao","distance_km":41.53,"station_lat":17.613,"station_lng":121.726},"17.6751,121.64761":{"nearest_station":"Tuguegarao","distance_km":10.8,"station_lat":17.613,"station_lng":121.726},"17.69479,121.506":{"nearest_station":"Tuguegarao","distance_km":25.02,"station_lat":17.613,"station_lng":121.726},"17.60612,121.75936":{"nearest_station":"Tuguegarao","distance_km":3.62,"station_lat":17.613,"station_lng":121.726},"16.81421,121.6776":{"nearest_station":"Casiguran","distance_km":75.65,"station_lat":16.283,"station_lng":122.121},"16.78116,121.79567":{"nearest_station":"Casiguran","distance_km":65.35,"station_lat":16.283,"station_lng":122.121},"16.98169,121.63704":{"nearest_station":"Tuguegarao","distance_km":70.83,"station_lat":17.613,"station_lng":121.726},"16.89612,121.94109":{"nearest_station":"Casiguran","distance_km":70.82,"station_lat":16.283,"station_lng":122.121},"17.05083,121.7267":{"nearest_station":"Tuguegarao","distance_km":62.51,"station_lat":17.613,"station_lng":121.726},"17.37532,121.85247":{"nearest_station":"Tuguegarao","distance_km":29.64,"station_lat":17.613,"station_lng":121.726},"16.93703,121.66644":{"nearest_station":"Tuguegarao","distance_km":75.43,"station_lat":17.613,"station_lng":121.726},"16.9011,121.79982":{"nearest_station":"Casiguran","distance_km":76.78,"station_lat":16.283,"station_lng":122.121},"16.68348,121.46149":{"nearest_station":"Casiguran","distance_km":83.23,"station_lat":16.283,"station_lng":122.121},"17.26586,121.74806":{"nearest_station":"Tuguegarao","distance_km":38.67,"station_lat":17.613,"station_lng":121.726},"16.67606,122.24389":{"nearest_station":"Casiguran","distance_km":45.63,"station_lat":16.283,"station_lng":122.121},"17.27781,122.16798":{"nearest_station":"Tuguegarao","distance_km":59.89,"station_lat":17.613,"station_lng":121.726},"16.62979,121.82669":{"nearest_station":"Casiguran","distance_km":49.72,"station_lat":16.283,"station_lng":122.121},"17.07076,121.81163":{"nearest_station":"Tuguegarao","distance_km":60.98,"station_lat":17.613,"station_lng":121.726},"17.10166,121.86582":{"nearest_station":"Tuguegarao","distance_km":58.76,"station_lat":17.613,"station_lng":121.726},"16.55859,121.77828":{"nearest_station":"Casiguran","distance_km":47.7,"station_lat":16.283,"station_lng":122.121},"16.97706,121.73191":{"nearest_station":"Tuguegarao","distance_km":70.72,"station_lat":17.613,"station_lng":121.726},"17.3629,122.13404":{"nearest_station":"Tuguegarao","distance_km":51.44,"station_lat":17.613,"station_lng":121.726},"17.17411,121.62445":{"nearest_station":"Tuguegarao","distance_km":49.98,"station_lat":17.613,"station_lng":121.726},"16.99692,121.87605":{"nearest_station":"Tuguegarao","distance_km":70.33,"station_lat":17.613,"station_lng":121.726},"17.04327,122.50377":{"nearest_station":"Casiguran","distance_km":93.86,"station_lat":16.283,"station_lng":122.121},"17.2877,121.62119":{"nearest_station":"Tuguegarao","distance_km":37.84,"station_lat":17.613,"station_lng":121.726},"17.15889,121.74547":{"nearest_station":"Tuguegarao","distance_km":50.54,"station_lat":17.613,"station_lng":121.726},"16.80387,121.5252":{"nearest_station":"Casiguran","distance_km":85.95,"station_lat":16.283,"station_lng":122.121},"17.00612,121.79817":{"nearest_station":"Tuguegarao","distance_km":67.92,"station_lat":17.613,"station_lng":121.726},"17.09782,121.62142":{"nearest_station":"Tuguegarao","distance_km":58.35,"station_lat":17.613,"station_lng":121.726},"16.47806,121.83421":{"nearest_station":"Casiguran","distance_km":37.5,"station_lat":16.283,"station_lng":122.121},"16.69352,121.98506":{"nearest_station":"Casiguran","distance_km":47.89,"station_lat":16.283,"station_lng":122.121},"16.74397,121.62598":{"nearest_station":"Casiguran","distance_km":73.57,"station_lat":16.283,"station_lng":122.121},"17.0316,121.62303":{"nearest_station":"Tuguegarao","distance_km":65.57,"station_lat":17.613,"station_lng":121.726},"16.87665,122.15248":{"nearest_station":"Casiguran","distance_km":66.1,"station_lat":16.283,"station_lng":122.121},"16.87377,121.60011":{"nearest_station":"Tuguegarao","distance_km":83.28,"station_lat":17.613,"station_lng":121.726},"17.47063,122.00543":{"nearest_station":"Tuguegarao","distance_km":33.59,"station_lat":17.613,"station_lng":121.726},"17.47377,121.72818":{"nearest_station":"Tuguegarao","distance_km":15.48,"station_lat":17.613,"station_lng":121.726},"16.72165,121.4948":{"nearest_station":"Casiguran","distance_km":82.68,"station_lat":16.283,"station_lng":122.121},"17.36646,121.75324":{"nearest_station":"Tuguegarao","distance_km":27.57,"station_lat":17.613,"station_lng":121.726},"17.27059,121.89567":{"nearest_station":"Tuguegarao","distance_km":42.11,"station_lat":17.613,"station_lng":121.726},"15.91074,121.32472":{"nearest_station":"Baler Radar","distance_km":30.25,"station_lat":15.757,"station_lng":121.558},"16.55062,121.04765":{"nearest_station":"Baler Radar","distance_km":103.72,"station_lat":15.757,"station_lng":121.558},"16.24346,121.02978":{"nearest_station":"Baler Radar","distance_km":78.19,"station_lat":15.757,"station_lng":121.558},"16.5863,121.27185":{"nearest_station":"Casiguran","distance_km":96.64,"station_lat":16.283,"station_lng":122.121},"16.39123,121.11641":{"nearest_station":"Baler Radar","distance_km":84.85,"station_lat":15.757,"station_lng":121.558},"16.48068,121.14116":{"nearest_station":"Baler Radar","distance_km":91.97,"station_lat":15.757,"station_lng":121.558},"16.62645,121.35493":{"nearest_station":"Casiguran","distance_km":90.18,"station_lat":16.283,"station_lng":122.121},"16.20589,121.23625":{"nearest_station":"Baler Radar","distance_km":60.62,"station_lat":15.757,"station_lng":121.558},"16.11497,121.18632":{"nearest_station":"Baler Radar","distance_km":56.25,"station_lat":15.757,"station_lng":121.558},"16.35766,121.32917":{"nearest_station":"Baler Radar","distance_km":71.13,"station_lat":15.757,"station_lng":121.558},"16.40911,120.91836":{"nearest_station":"Baler Radar","distance_km":99.64,"station_lat":15.757,"station_lng":121.558},"16.46986,121.29457":{"nearest_station":"Baler Radar","distance_km":84.11,"station_lat":15.757,"station_lng":121.558},"16.18131,120.91691":{"nearest_station":"CLSU","distance_km":76.87,"station_lat":15.502,"station_lng":121.05},"16.5347,121.18953":{"nearest_station":"Baler Radar","distance_km":95.01,"station_lat":15.757,"station_lng":121.558},"16.60102,121.16184":{"nearest_station":"Baler Radar","distance_km":102.95,"station_lat":15.757,"station_lng":121.558},"16.43387,121.62009":{"nearest_station":"Casiguran","distance_km":56.01,"station_lat":16.283,"station_lng":122.121},"16.43744,121.50607":{"nearest_station":"Casiguran","distance_km":67.82,"station_lat":16.283,"station_lng":122.121},"16.55244,121.46137":{"nearest_station":"Casiguran","distance_km":76.47,"station_lat":16.283,"station_lng":122.121},"16.36044,121.79847":{"nearest_station":"Casiguran","distance_km":35.48,"station_lat":16.283,"station_lng":122.121},"16.15603,121.51227":{"nearest_station":"Baler Radar","distance_km":44.64,"station_lat":15.757,"station_lng":121.558},"16.54521,121.57958":{"nearest_station":"Casiguran","distance_km":64.69,"station_lat":16.283,"station_lng":122.121},"15.7329,121.57193":{"nearest_station":"Baler Radar","distance_km":3.07,"station_lat":15.757,"station_lng":121.558},"16.14054,122.06842":{"nearest_station":"Casiguran","distance_km":16.81,"station_lat":16.283,"station_lng":122.121},"16.43295,122.13391":{"nearest_station":"Casiguran","distance_km":16.73,"station_lat":16.283,"station_lng":122.121},"16.16856,121.8597":{"nearest_station":"Casiguran","distance_km":30.66,"station_lat":16.283,"station_lng":122.121},"15.28387,121.38254":{"nearest_station":"CLSU","distance_km":43.12,"station_lat":15.502,"station_lng":121.05},"15.88333,121.55111":{"nearest_station":"Baler Radar","distance_km":14.07,"station_lat":15.757,"station_lng":121.558},"15.77676,121.40335":{"nearest_station":"Baler Radar","distance_km":16.69,"station_lat":15.757,"station_lng":121.558},"15.48858,121.4872":{"nearest_station":"Baler Radar","distance_km":30.79,"station_lat":15.757,"station_lng":121.558},"14.71799,120.48488":{"nearest_station":"Cubi Point","distance_km":24.5,"station_lat":14.794,"station_lng":120.271},"14.58413,120.42585":{"nearest_station":"Cubi Point","distance_km":28.67,"station_lat":14.794,"station_lng":120.271},"14.66715,120.49286":{"nearest_station":"Cubi Point","distance_km":27.72,"station_lat":14.794,"station_lng":120.271},"14.86965,120.43192":{"nearest_station":"Cubi Point","distance_km":19.23,"station_lat":14.794,"station_lng":120.271},"14.81327,120.44745":{"nearest_station":"Cubi Point","distance_km":19.09,"station_lat":14.794,"station_lng":120.271},"14.53879,120.55444":{"nearest_station":"Cubi Point","distance_km":41.65,"station_lat":14.794,"station_lng":120.271},"14.44889,120.58972":{"nearest_station":"Cubi Point","distance_km":51.46,"station_lat":14.794,"station_lng":120.271},"14.79314,120.26":{"nearest_station":"Cubi Point","distance_km":1.19,"station_lat":14.794,"station_lng":120.271},"14.77844,120.47741":{"nearest_station":"Cubi Point","distance_km":22.26,"station_lat":14.794,"station_lng":120.271},"14.60295,120.55163":{"nearest_station":"Cubi Point","distance_km":36.91,"station_lat":14.794,"station_lng":120.271},"14.63034,120.52021":{"nearest_station":"Cubi Point","distance_km":32.4,"station_lat":14.794,"station_lng":120.271},"14.7528,120.48256":{"nearest_station":"Cubi Point","distance_km":23.2,"station_lat":14.794,"station_lng":120.271},"14.92997,121.03564":{"nearest_station":"Clark","distance_km":58.57,"station_lat":15.186,"station_lng":120.559},"14.82774,120.92082":{"nearest_station":"Clark","distance_km":55.65,"station_lat":15.186,"station_lng":120.559},"14.9515,120.90164":{"nearest_station":"Clark","distance_km":45.09,"station_lat":15.186,"station_lng":120.559},"14.79009,120.94064":{"nearest_station":"Clark","distance_km":60.15,"station_lat":15.186,"station_lng":120.559},"14.76567,120.87655":{"nearest_station":"Clark","distance_km":57.86,"station_lat":15.186,"station_lng":120.559},"14.92272,120.95187":{"nearest_station":"Clark","distance_km":51.35,"station_lat":15.186,"station_lng":120.559},"14.89267,120.77963":{"nearest_station":"Clark","distance_km":40.31,"station_lat":15.186,"station_lng":120.559},"15.06335,121.209":{"nearest_station":"CLSU","distance_km":51.67,"station_lat":15.502,"station_lng":121.05},"14.83746,120.89234":{"nearest_station":"Clark","distance_km":52.76,"station_lat":15.186,"station_lng":120.559},"14.80776,120.74162":{"nearest_station":"Clark","distance_km":46.41,"station_lat":15.186,"station_lng":120.559},"14.82959,120.83675":{"nearest_station":"Clark","distance_km":49.6,"station_lat":15.186,"station_lng":120.559},"14.76856,120.988":{"nearest_station":"Clark","distance_km":65.41,"station_lat":15.186,"station_lng":120.559},"14.73464,120.99566":{"nearest_station":"Clark","distance_km":68.7,"station_lat":15.186,"station_lng":120.559},"14.87898,121.18132":{"nearest_station":"CLSU","distance_km":70.7,"station_lat":15.502,"station_lng":121.05},"14.7138,120.92667":{"nearest_station":"Clark","distance_km":65.7,"station_lat":15.186,"station_lng":120.559},"14.87472,120.96675":{"nearest_station":"Clark","distance_km":55.82,"station_lat":15.186,"station_lng":120.559},"14.80477,120.79512":{"nearest_station":"Clark","distance_km":49.4,"station_lat":15.186,"station_lng":120.559},"14.88228,120.88287":{"nearest_station":"Clark","distance_km":48.48,"station_lat":15.186,"station_lng":120.559},"14.91387,120.85563":{"nearest_station":"Clark","distance_km":43.93,"station_lat":15.186,"station_lng":120.559},"15.05011,121.03377":{"nearest_station":"CLSU","distance_km":50.28,"station_lat":15.502,"station_lng":121.05},"14.77859,121.05473":{"nearest_station":"Clark","distance_km":69.91,"station_lat":15.186,"station_lng":120.559},"15.1731,121.04012":{"nearest_station":"CLSU","distance_km":36.59,"station_lat":15.502,"station_lng":121.05},"14.98345,120.99147":{"nearest_station":"Clark","distance_km":51.61,"station_lat":15.186,"station_lng":120.559},"14.83219,120.99868":{"nearest_station":"Clark","distance_km":61.46,"station_lat":15.186,"station_lng":120.559},"15.50733,120.85916":{"nearest_station":"CLSU","distance_km":20.46,"station_lat":15.502,"station_lng":121.05},"15.65139,121.23135":{"nearest_station":"CLSU","distance_km":25.56,"station_lat":15.502,"station_lng":121.05},"15.49244,120.98994":{"nearest_station":"CLSU","distance_km":6.52,"station_lat":15.502,"station_lng":121.05},"15.2344,120.84959":{"nearest_station":"Clark","distance_km":31.64,"station_lat":15.186,"station_lng":120.559},"16.00315,121.0412":{"nearest_station":"CLSU","distance_km":55.73,"station_lat":15.502,"station_lng":121.05},"15.79299,120.69991":{"nearest_station":"CLSU","distance_km":49.52,"station_lat":15.502,"station_lng":121.05},"15.51859,121.29289":{"nearest_station":"CLSU","distance_km":26.09,"station_lat":15.502,"station_lng":121.05},"15.28284,121.00535":{"nearest_station":"CLSU","distance_km":24.83,"station_lat":15.502,"station_lng":121.05},"15.58758,121.04593":{"nearest_station":"CLSU","distance_km":9.53,"station_lat":15.502,"station_lng":121.05},"15.34019,121.21792":{"nearest_station":"CLSU","distance_km":25.45,"station_lat":15.502,"station_lng":121.05},"15.66672,120.75616":{"nearest_station":"CLSU","distance_km":36.41,"station_lat":15.502,"station_lng":121.05},"15.37921,120.87889":{"nearest_station":"CLSU","distance_km":22.86,"station_lat":15.502,"station_lng":121.05},"15.52335,121.17886":{"nearest_station":"CLSU","distance_km":14.01,"station_lat":15.502,"station_lng":121.05},"15.55126,120.75995":{"nearest_station":"CLSU","distance_km":31.55,"station_lat":15.502,"station_lng":121.05},"15.66229,120.99403":{"nearest_station":"CLSU","distance_km":18.8,"station_lat":15.502,"station_lng":121.05},"15.84732,120.91252":{"nearest_station":"CLSU","distance_km":41.12,"station_lat":15.502,"station_lng":121.05},"15.72036,120.66125":{"nearest_station":"CLSU","distance_km":48.2,"station_lat":15.502,"station_lng":121.05},"15.52215,121.10485":{"nearest_station":"CLSU","distance_km":6.29,"station_lat":15.502,"station_lng":121.05},"15.8086,121.15906":{"nearest_station":"CLSU","distance_km":36.04,"station_lat":15.502,"station_lng":121.05},"15.35499,121.02523":{"nearest_station":"CLSU","distance_km":16.56,"station_lat":15.502,"station_lng":121.05},"15.57843,120.82588":{"nearest_station":"CLSU","distance_km":25.47,"station_lat":15.502,"station_lng":121.05},"15.68672,121.10741":{"nearest_station":"CLSU","distance_km":21.44,"station_lat":15.502,"station_lng":121.05},"15.33154,120.8098":{"nearest_station":"Clark","distance_km":31.4,"station_lat":15.186,"station_lng":120.559},"15.26485,120.91366":{"nearest_station":"CLSU","distance_km":30.15,"station_lat":15.502,"station_lng":121.05},"15.78462,120.99758":{"nearest_station":"CLSU","distance_km":31.92,"station_lat":15.502,"station_lng":121.05},"15.35961,120.94741":{"nearest_station":"CLSU","distance_km":19.28,"station_lat":15.502,"station_lng":121.05},"15.4311,120.98799":{"nearest_station":"CLSU","distance_km":10.31,"station_lat":15.502,"station_lng":121.05},"15.62002,120.88039":{"nearest_station":"CLSU","distance_km":22.41,"station_lat":15.502,"station_lng":121.05},"15.72903,120.89448":{"nearest_station":"CLSU","distance_km":30.24,"station_lat":15.502,"station_lng":121.05},"15.61404,120.9345":{"nearest_station":"CLSU","distance_km":17.56,"station_lat":15.502,"station_lng":121.05},"15.76387,120.80946":{"nearest_station":"CLSU","distance_km":38.88,"station_lat":15.502,"station_lng":121.05},"15.45336,120.78813":{"nearest_station":"CLSU","distance_km":28.58,"station_lat":15.502,"station_lng":121.05},"15.14556,120.58625":{"nearest_station":"Clark","distance_km":5.36,"station_lat":15.186,"station_lng":120.559},"14.94826,120.80383":{"nearest_station":"Clark","distance_km":37.28,"station_lat":15.186,"station_lng":120.559},"15.17565,120.7785":{"nearest_station":"Clark","distance_km":23.58,"station_lat":15.186,"station_lng":120.559},"15.03215,120.65649":{"nearest_station":"Clark","distance_km":20.05,"station_lat":15.186,"station_lng":120.559},"15.10155,120.905":{"nearest_station":"Clark","distance_km":38.31,"station_lat":15.186,"station_lng":120.559},"14.98771,120.48686":{"nearest_station":"Clark","distance_km":23.37,"station_lat":15.186,"station_lng":120.559},"14.96798,120.63124":{"nearest_station":"Clark","distance_km":25.45,"station_lat":15.186,"station_lng":120.559},"14.88929,120.57371":{"nearest_station":"Clark","distance_km":33.03,"station_lat":15.186,"station_lng":120.559},"15.18779,120.51577":{"nearest_station":"Clark","distance_km":4.64,"station_lat":15.186,"station_lng":120.559},"14.89844,120.71433":{"nearest_station":"Clark","distance_km":36.06,"station_lat":15.186,"station_lng":120.559},"15.23128,120.69275":{"nearest_station":"Clark","distance_km":15.21,"station_lat":15.186,"station_lng":120.559},"14.8336,120.68119":{"nearest_station":"Clark","distance_km":41.32,"station_lat":15.186,"station_lng":120.559},"15.10409,120.71604":{"nearest_station":"Clark","distance_km":19.16,"station_lat":15.186,"station_lng":120.559},"14.95298,120.72003":{"nearest_station":"Clark","distance_km":31.15,"station_lat":15.186,"station_lng":120.559},"15.08354,120.51645":{"nearest_station":"Clark","distance_km":12.27,"station_lat":15.186,"station_lng":120.559},"15.06108,120.68869":{"nearest_station":"Clark","distance_km":19.67,"station_lat":15.186,"station_lng":120.559},"15.02689,120.83063":{"nearest_station":"Clark","distance_km":34.11,"station_lat":15.186,"station_lng":120.559},"14.99301,120.8112":{"nearest_station":"Clark","distance_km":34.55,"station_lat":15.186,"station_lng":120.559},"15.09959,120.7933":{"nearest_station":"Clark","distance_km":26.92,"station_lat":15.186,"station_lng":120.559},"15.01019,120.61493":{"nearest_station":"Clark","distance_km":20.45,"station_lat":15.186,"station_lng":120.559},"14.99156,120.74183":{"nearest_station":"Clark","distance_km":29.2,"station_lat":15.186,"station_lng":120.559},"14.87992,120.64135":{"nearest_station":"Clark","distance_km":35.16,"station_lat":15.186,"station_lng":120.559},"15.74221,120.61429":{"nearest_station":"CLSU","distance_km":53.76,"station_lat":15.502,"station_lng":121.05},"15.24318,120.47274":{"nearest_station":"Clark","distance_km":11.23,"station_lat":15.186,"station_lng":120.559},"15.69337,120.41828":{"nearest_station":"Clark","distance_km":58.4,"station_lat":15.186,"station_lng":120.559},"15.33041,120.443":{"nearest_station":"Clark","distance_km":20.32,"station_lat":15.186,"station_lng":120.559},"15.33055,120.67844":{"nearest_station":"Clark","distance_km":20.56,"station_lat":15.186,"station_lng":120.559},"15.601,120.56557":{"nearest_station":"Clark","distance_km":46.15,"station_lat":15.186,"station_lng":120.559},"15.44686,120.71467":{"nearest_station":"Clark","distance_km":33.47,"station_lat":15.186,"station_lng":120.559},"15.55968,120.30848":{"nearest_station":"Iba","distance_km":44.12,"station_lat":15.327,"station_lng":119.975},"15.74456,120.55338":{"nearest_station":"CLSU","distance_km":59.63,"station_lat":15.502,"station_lng":121.05},"15.67237,120.54055":{"nearest_station":"Clark","distance_km":54.12,"station_lat":15.186,"station_lng":120.559},"15.62826,120.64578":{"nearest_station":"CLSU","distance_km":45.52,"station_lat":15.502,"station_lng":121.05},"15.67908,120.62642":{"nearest_station":"CLSU","distance_km":49.46,"station_lat":15.502,"station_lng":121.05},"15.66677,120.33293":{"nearest_station":"Iba","distance_km":53.84,"station_lat":15.327,"station_lng":119.975},"15.43728,120.34081":{"nearest_station":"Clark","distance_km":36.45,"station_lat":15.186,"station_lng":120.559},"15.82882,120.5974":{"nearest_station":"CLSU","distance_km":60.57,"station_lat":15.502,"station_lng":121.05},"15.58264,120.44711":{"nearest_station":"Clark","distance_km":45.71,"station_lat":15.186,"station_lng":120.559},"15.48442,120.60183":{"nearest_station":"Clark","distance_km":33.5,"station_lat":15.186,"station_lng":120.559},"15.57575,120.68575":{"nearest_station":"CLSU","distance_km":39.87,"station_lat":15.502,"station_lng":121.05},"15.22973,120.2001":{"nearest_station":"Iba","distance_km":26.46,"station_lat":15.327,"station_lng":119.975},"15.16112,120.12289":{"nearest_station":"Iba","distance_km":24.33,"station_lat":15.327,"station_lng":119.975},"15.63769,120.08341":{"nearest_station":"Iba","distance_km":36.45,"station_lat":15.327,"station_lng":119.975},"14.94194,120.21771":{"nearest_station":"Cubi Point","distance_km":17.42,"station_lat":14.794,"station_lng":120.271},"15.37631,120.05017":{"nearest_station":"Iba","distance_km":9.75,"station_lat":15.327,"station_lng":119.975},"15.51228,119.92138":{"nearest_station":"Iba","distance_km":21.39,"station_lat":15.327,"station_lng":119.975},"14.88623,120.34263":{"nearest_station":"Cubi Point","distance_km":12.82,"station_lat":14.794,"station_lng":120.271},"15.45216,120.04186":{"nearest_station":"Iba","distance_km":15.65,"station_lat":15.327,"station_lng":119.975},"14.84672,120.08249":{"nearest_station":"Cubi Point","distance_km":21.1,"station_lat":14.794,"station_lng":120.271},"15.07385,120.12611":{"nearest_station":"Iba","distance_km":32.49,"station_lat":15.327,"station_lng":119.975},"15.0271,120.28235":{"nearest_station":"Cubi Point","distance_km":25.95,"station_lat":14.794,"station_lng":120.271},"15.01219,120.11172":{"nearest_station":"Cubi Point","distance_km":29.69,"station_lat":14.794,"station_lng":120.271},"15.78587,119.78861":{"nearest_station":"Iba","distance_km":54.79,"station_lat":15.327,"station_lng":119.975},"14.89514,120.26286":{"nearest_station":"Cubi Point","distance_km":11.28,"station_lat":14.794,"station_lng":120.271},"13.28171,123.84869":{"nearest_station":"Legazpi","distance_km":19.82,"station_lat":13.142,"station_lng":123.735},"13.14185,123.63762":{"nearest_station":"Legazpi","distance_km":10.54,"station_lat":13.142,"station_lng":123.735},"13.11153,123.69012":{"nearest_station":"Legazpi","distance_km":5.92,"station_lat":13.142,"station_lng":123.735},"13.17463,123.57564":{"nearest_station":"Legazpi","distance_km":17.63,"station_lat":13.142,"station_lng":123.735},"13.04979,123.57939":{"nearest_station":"Legazpi","distance_km":19.73,"station_lat":13.142,"station_lng":123.735},"13.10005,123.75429":{"nearest_station":"Legazpi","distance_km":5.11,"station_lat":13.142,"station_lng":123.735},"13.24708,123.37057":{"nearest_station":"Legazpi","distance_km":41.15,"station_lat":13.142,"station_lng":123.735},"13.18231,123.49442":{"nearest_station":"Legazpi","distance_km":26.43,"station_lat":13.142,"station_lng":123.735},"13.30542,123.73439":{"nearest_station":"Legazpi","distance_km":18.17,"station_lat":13.142,"station_lng":123.735},"13.38457,123.65228":{"nearest_station":"Legazpi","distance_km":28.42,"station_lat":13.142,"station_lng":123.735},"13.08633,123.87805":{"nearest_station":"Legazpi","distance_km":16.68,"station_lat":13.142,"station_lng":123.735},"13.16779,123.40341":{"nearest_station":"Legazpi","distance_km":36.02,"station_lat":13.142,"station_lng":123.735},"13.06252,123.46796":{"nearest_station":"Legazpi","distance_km":30.24,"station_lat":13.142,"station_lng":123.735},"13.33268,123.50519":{"nearest_station":"Legazpi","distance_km":32.68,"station_lat":13.142,"station_lng":123.735},"13.26345,124.03778":{"nearest_station":"Legazpi","distance_km":35.45,"station_lat":13.142,"station_lng":123.735},"13.24826,123.75467":{"nearest_station":"Legazpi","distance_km":12.01,"station_lat":13.142,"station_lng":123.735},"13.33523,123.69657":{"nearest_station":"Legazpi","distance_km":21.88,"station_lat":13.142,"station_lng":123.735},"13.46293,123.61563":{"nearest_station":"Legazpi","distance_km":37.95,"station_lat":13.142,"station_lng":123.735},"13.9933,122.97862":{"nearest_station":"Daet","distance_km":14.42,"station_lat":14.12,"station_lng":122.95},"14.34872,122.52265":{"nearest_station":"Daet","distance_km":52.61,"station_lat":14.12,"station_lng":122.95},"14.10985,122.95011":{"nearest_station":"Daet","distance_km":1.13,"station_lat":14.12,"station_lng":122.95},"14.31861,122.67312":{"nearest_station":"Daet","distance_km":37.13,"station_lat":14.12,"station_lng":122.95},"14.13414,122.68416":{"nearest_station":"Daet","distance_km":28.71,"station_lat":14.12,"station_lng":122.95},"14.10444,123.03056":{"nearest_station":"Daet","distance_km":8.86,"station_lat":14.12,"station_lng":122.95},"14.25126,122.78854":{"nearest_station":"Daet","distance_km":22.72,"station_lat":14.12,"station_lng":122.95},"14.01403,122.88247":{"nearest_station":"Daet","distance_km":13.85,"station_lat":14.12,"station_lng":122.95},"14.0785,122.85994":{"nearest_station":"Daet","distance_km":10.75,"station_lat":14.12,"station_lng":122.95},"14.18269,122.34492":{"nearest_station":"Daet","distance_km":65.61,"station_lat":14.12,"station_lng":122.95},"14.14286,122.92438":{"nearest_station":"Daet","distance_km":3.75,"station_lat":14.12,"station_lng":122.95},"14.37173,122.96273":{"nearest_station":"Daet","distance_km":28.02,"station_lat":14.12,"station_lng":122.95},"13.48294,123.36639":{"nearest_station":"Legazpi","distance_km":55.03,"station_lat":13.142,"station_lng":123.735},"13.35008,123.25136":{"nearest_station":"Legazpi","distance_km":57.23,"station_lat":13.142,"station_lng":123.735},"13.31841,123.31363":{"nearest_station":"Legazpi","distance_km":49.65,"station_lat":13.142,"station_lng":123.735},"13.68352,123.20437":{"nearest_station":"Daet","distance_km":55.76,"station_lat":14.12,"station_lng":122.95},"13.43719,123.51455":{"nearest_station":"Legazpi","distance_km":40.58,"station_lat":13.142,"station_lng":123.735},"13.4563,123.2623":{"nearest_station":"Legazpi","distance_km":61.95,"station_lat":13.142,"station_lng":123.735},"13.74255,123.07086":{"nearest_station":"Daet","distance_km":43.95,"station_lat":14.12,"station_lng":122.95},"13.71032,123.27109":{"nearest_station":"Daet","distance_km":57.24,"station_lat":14.12,"station_lng":122.95},"13.62549,123.16268":{"nearest_station":"Daet","distance_km":59.59,"station_lat":14.12,"station_lng":122.95},"13.64276,123.13013":{"nearest_station":"Daet","distance_km":56.52,"station_lat":14.12,"station_lng":122.95},"13.74833,123.96832":{"nearest_station":"Virac Synop","distance_km":34.3,"station_lat":13.584,"station_lng":124.237},"13.94606,122.7085":{"nearest_station":"Daet","distance_km":32.45,"station_lat":14.12,"station_lng":122.95},"13.60839,123.13309":{"nearest_station":"Daet","distance_km":60.22,"station_lat":14.12,"station_lng":122.95},"13.88858,123.73865":{"nearest_station":"Virac Synop","distance_km":63.6,"station_lat":13.584,"station_lng":124.237},"13.7313,123.42455":{"nearest_station":"Daet","distance_km":67.02,"station_lat":14.12,"station_lng":122.95},"13.44838,123.4333":{"nearest_station":"Legazpi","distance_km":47.19,"station_lat":13.142,"station_lng":123.735},"13.92775,123.54666":{"nearest_station":"Daet","distance_km":67.83,"station_lat":14.12,"station_lng":122.95},"13.66597,122.97428":{"nearest_station":"Daet","distance_km":50.55,"station_lat":14.12,"station_lng":122.95},"13.84807,122.88795":{"nearest_station":"Daet","distance_km":30.97,"station_lat":14.12,"station_lng":122.95},"13.66955,123.15481":{"nearest_station":"Daet","distance_km":54.75,"station_lat":14.12,"station_lng":122.95},"13.59194,123.17272":{"nearest_station":"Daet","distance_km":63.45,"station_lat":14.12,"station_lng":122.95},"13.51569,123.19524":{"nearest_station":"Legazpi","distance_km":71.68,"station_lat":13.142,"station_lng":123.735},"13.3928,123.33855":{"nearest_station":"Legazpi","distance_km":51.17,"station_lat":13.142,"station_lng":123.735},"13.64369,123.25947":{"nearest_station":"Daet","distance_km":62.62,"station_lat":14.12,"station_lng":122.95},"13.58161,123.38249":{"nearest_station":"Legazpi","distance_km":62.0,"station_lat":13.142,"station_lng":123.735},"13.59262,123.06987":{"nearest_station":"Daet","distance_km":60.05,"station_lat":14.12,"station_lng":122.95},"13.55141,122.99891":{"nearest_station":"Daet","distance_km":63.44,"station_lat":14.12,"station_lng":122.95},"13.5883,123.28976":{"nearest_station":"Legazpi","distance_km":69.16,"station_lat":13.142,"station_lng":123.735},"13.74509,123.7264":{"nearest_station":"Virac Synop","distance_km":58.0,"station_lat":13.584,"station_lng":124.237},"13.86078,122.64932":{"nearest_station":"Daet","distance_km":43.4,"station_lat":14.12,"station_lng":122.95},"13.55924,123.51627":{"nearest_station":"Legazpi","distance_km":52.08,"station_lat":13.142,"station_lng":123.735},"13.52454,123.12647":{"nearest_station":"Daet","distance_km":68.9,"station_lat":14.12,"station_lng":122.95},"13.69228,123.53329":{"nearest_station":"Legazpi","distance_km":64.96,"station_lat":13.142,"station_lng":123.735},"13.79843,122.96553":{"nearest_station":"Daet","distance_km":35.8,"station_lat":14.12,"station_lng":122.95},"14.06478,123.26328":{"nearest_station":"Daet","distance_km":34.34,"station_lat":14.12,"station_lng":122.95},"13.62858,123.47155":{"nearest_station":"Legazpi","distance_km":61.15,"station_lat":13.142,"station_lng":123.735},"13.95334,123.32141":{"nearest_station":"Daet","distance_km":44.14,"station_lat":14.12,"station_lng":122.95},"13.95138,124.25745":{"nearest_station":"Virac Synop","distance_km":40.91,"station_lat":13.584,"station_lng":124.237},"13.69355,124.36398":{"nearest_station":"Virac Synop","distance_km":18.35,"station_lat":13.584,"station_lng":124.237},"13.60086,124.31342":{"nearest_station":"Virac Synop","distance_km":8.47,"station_lat":13.584,"station_lng":124.237},"13.84948,124.17928":{"nearest_station":"Virac Synop","distance_km":30.17,"station_lat":13.584,"station_lng":124.237},"13.78572,124.35497":{"nearest_station":"Virac Synop","distance_km":25.8,"station_lat":13.584,"station_lng":124.237},"14.01972,124.04972":{"nearest_station":"Virac Synop","distance_km":52.5,"station_lat":13.584,"station_lng":124.237},"13.89795,124.27573":{"nearest_station":"Virac Synop","distance_km":35.16,"station_lat":13.584,"station_lng":124.237},"13.60315,124.15388":{"nearest_station":"Virac Synop","distance_km":9.23,"station_lat":13.584,"station_lng":124.237},"13.69855,124.27302":{"nearest_station":"Virac Synop","distance_km":13.32,"station_lat":13.584,"station_lng":124.237},"13.84717,124.30925":{"nearest_station":"Virac Synop","distance_km":30.29,"station_lat":13.584,"station_lng":124.237},"13.61574,124.19676":{"nearest_station":"Virac Synop","distance_km":5.6,"station_lat":13.584,"station_lng":124.237},"12.5875,123.26806":{"nearest_station":"Masbate","distance_km":45.53,"station_lat":12.371,"station_lng":123.624},"12.4119,123.47211":{"nearest_station":"Masbate","distance_km":17.11,"station_lat":12.371,"station_lng":123.624},"12.07528,123.31834":{"nearest_station":"Masbate","distance_km":46.74,"station_lat":12.371,"station_lng":123.624},"12.40446,123.76216":{"nearest_station":"Masbate","distance_km":15.46,"station_lat":12.371,"station_lng":123.624},"11.99931,123.96202":{"nearest_station":"Masbate","distance_km":55.3,"station_lat":12.371,"station_lng":123.624},"11.93,123.72889":{"nearest_station":"Masbate","distance_km":50.35,"station_lat":12.371,"station_lng":123.624},"12.89861,123.25972":{"nearest_station":"Legazpi","distance_km":58.17,"station_lat":13.142,"station_lng":123.735},"12.15738,123.83992":{"nearest_station":"Masbate","distance_km":33.39,"station_lat":12.371,"station_lng":123.624},"11.81029,124.00664":{"nearest_station":"Masbate","distance_km":74.95,"station_lat":12.371,"station_lng":123.624},"12.24194,123.2525":{"nearest_station":"Masbate","distance_km":42.83,"station_lat":12.371,"station_lng":123.624},"12.33791,123.56534":{"nearest_station":"Masbate","distance_km":7.36,"station_lat":12.371,"station_lng":123.624},"12.16806,123.40833":{"nearest_station":"Masbate","distance_km":32.53,"station_lat":12.371,"station_lng":123.624},"12.27758,123.66485":{"nearest_station":"Masbate","distance_km":11.3,"station_lat":12.371,"station_lng":123.624},"12.60056,123.60973":{"nearest_station":"Masbate","distance_km":25.57,"station_lat":12.371,"station_lng":123.624},"12.09877,123.89074":{"nearest_station":"Masbate","distance_km":41.91,"station_lat":12.371,"station_lng":123.624},"11.85083,124.03391":{"nearest_station":"Masbate","distance_km":73.02,"station_lat":12.371,"station_lng":123.624},"11.94875,123.87547":{"nearest_station":"Masbate","distance_km":54.33,"station_lat":12.371,"station_lng":123.624},"12.47962,123.72903":{"nearest_station":"Masbate","distance_km":16.61,"station_lat":12.371,"station_lng":123.624},"12.55326,123.68944":{"nearest_station":"Masbate","distance_km":21.48,"station_lat":12.371,"station_lng":123.624},"13.13621,123.01737":{"nearest_station":"Legazpi","distance_km":77.71,"station_lat":13.142,"station_lng":123.735},"12.18513,123.75138":{"nearest_station":"Masbate","distance_km":24.87,"station_lat":12.371,"station_lng":123.624},"12.83794,124.11624":{"nearest_station":"Juban","distance_km":14.07,"station_lat":12.849,"station_lng":123.987},"12.68135,123.92534":{"nearest_station":"Juban","distance_km":19.81,"station_lat":12.849,"station_lng":123.987},"12.75963,124.10537":{"nearest_station":"Juban","distance_km":16.23,"station_lat":12.849,"station_lng":123.987},"12.85995,124.04292":{"nearest_station":"Juban","distance_km":6.18,"station_lat":12.849,"station_lng":123.987},"12.88194,123.76722":{"nearest_station":"Juban","distance_km":24.1,"station_lat":12.849,"station_lng":123.987},"12.97106,123.57611":{"nearest_station":"Legazpi","distance_km":25.64,"station_lat":13.142,"station_lng":123.735},"12.92687,124.10759":{"nearest_station":"Juban","distance_km":15.68,"station_lat":12.849,"station_lng":123.987},"12.71459,124.03":{"nearest_station":"Juban","distance_km":15.66,"station_lat":12.849,"station_lng":123.987},"12.81133,123.97299":{"nearest_station":"Juban","distance_km":4.46,"station_lat":12.849,"station_lng":123.987},"12.83528,123.79083":{"nearest_station":"Juban","distance_km":21.32,"station_lat":12.849,"station_lng":123.987},"12.55022,124.10623":{"nearest_station":"Juban","distance_km":35.65,"station_lat":12.849,"station_lng":123.987},"12.89583,123.69361":{"nearest_station":"Legazpi","distance_km":27.74,"station_lat":13.142,"station_lng":123.735},"13.0367,124.16317":{"nearest_station":"Juban","distance_km":28.29,"station_lat":12.849,"station_lng":123.987},"12.65602,124.08763":{"nearest_station":"Juban","distance_km":24.07,"station_lat":12.849,"station_lng":123.987},"13.03354,124.10373":{"nearest_station":"Juban","distance_km":24.11,"station_lat":12.849,"station_lng":123.987},"11.63884,124.41294":{"nearest_station":"Catbalogan","distance_km":53.69,"station_lat":11.775,"station_lng":124.886},"11.51228,124.48264":{"nearest_station":"Catbalogan","distance_km":52.75,"station_lat":11.775,"station_lng":124.886},"11.50076,124.56348":{"nearest_station":"Catbalogan","distance_km":46.52,"station_lat":11.775,"station_lng":124.886},"11.56003,124.55292":{"nearest_station":"Catbalogan","distance_km":43.44,"station_lat":11.775,"station_lng":124.886},"11.64218,124.50729":{"nearest_station":"Catbalogan","distance_km":43.8,"station_lat":11.775,"station_lng":124.886},"11.68272,124.40462":{"nearest_station":"Catbalogan","distance_km":53.4,"station_lat":11.775,"station_lng":124.886},"11.78876,124.3229":{"nearest_station":"Catbalogan","distance_km":61.31,"station_lat":11.775,"station_lng":124.886},"11.57695,124.43581":{"nearest_station":"Catbalogan","distance_km":53.74,"station_lat":11.775,"station_lng":124.886},"12.23453,125.32616":{"nearest_station":"Catbalogan","distance_km":70.02,"station_lat":11.775,"station_lng":124.886},"11.20166,125.36389":{"nearest_station":"Tacloban","distance_km":39.55,"station_lat":11.245,"station_lng":125.004},"11.4092,125.40522":{"nearest_station":"Borongan","distance_km":22.28,"station_lat":11.608,"station_lng":125.431},"11.59504,125.49688":{"nearest_station":"Borongan","distance_km":7.32,"station_lat":11.608,"station_lng":125.431},"11.98778,125.32983":{"nearest_station":"Borongan","distance_km":43.64,"station_lat":11.608,"station_lng":125.431},"12.07824,125.33509":{"nearest_station":"Borongan","distance_km":53.32,"station_lat":11.608,"station_lng":125.431},"11.26742,125.50717":{"nearest_station":"Guiuan","distance_km":35.3,"station_lat":11.03,"station_lng":125.722},"11.12705,125.47467":{"nearest_station":"Guiuan","distance_km":29.07,"station_lat":11.03,"station_lng":125.722},"10.76528,125.71222":{"nearest_station":"Guiuan","distance_km":29.45,"station_lat":11.03,"station_lng":125.722},"11.32668,125.59236":{"nearest_station":"Borongan","distance_km":35.89,"station_lat":11.608,"station_lng":125.431},"12.27825,125.20391":{"nearest_station":"Catbalogan","distance_km":65.78,"station_lat":11.775,"station_lng":124.886},"11.20207,125.28676":{"nearest_station":"Tacloban","distance_km":31.21,"station_lat":11.245,"station_lng":125.004},"11.34277,125.44759":{"nearest_station":"Borongan","distance_km":29.55,"station_lat":11.608,"station_lng":125.431},"12.10713,125.17517":{"nearest_station":"Catbalogan","distance_km":48.51,"station_lat":11.775,"station_lng":124.886},"11.4603,125.36096":{"nearest_station":"Borongan","distance_km":18.11,"station_lat":11.608,"station_lng":125.431},"11.08902,125.70536":{"nearest_station":"Guiuan","distance_km":6.81,"station_lat":11.03,"station_lng":125.722},"12.15269,125.38633":{"nearest_station":"Borongan","distance_km":60.76,"station_lat":11.608,"station_lng":125.431},"11.18957,125.4765":{"nearest_station":"Guiuan","distance_km":32.13,"station_lat":11.03,"station_lng":125.722},"11.17861,125.67667":{"nearest_station":"Guiuan","distance_km":17.25,"station_lat":11.03,"station_lng":125.722},"11.73133,125.3721":{"nearest_station":"Borongan","distance_km":15.14,"station_lat":11.608,"station_lng":125.431},"12.20729,125.45441":{"nearest_station":"Borongan","distance_km":66.69,"station_lat":11.608,"station_lng":125.431},"11.79566,125.37368":{"nearest_station":"Borongan","distance_km":21.78,"station_lat":11.608,"station_lng":125.431},"11.87768,125.34022":{"nearest_station":"Borongan","distance_km":31.57,"station_lat":11.608,"station_lng":125.431},"10.65845,125.04482":{"nearest_station":"Maasin","distance_km":62.63,"station_lat":10.131,"station_lng":124.844},"11.22003,124.86422":{"nearest_station":"Tacloban","distance_km":15.5,"station_lat":11.245,"station_lng":125.004},"10.92582,124.7455":{"nearest_station":"Tacloban","distance_km":45.34,"station_lat":11.245,"station_lng":125.004},"11.41588,124.9529":{"nearest_station":"Tacloban","distance_km":19.8,"station_lat":11.245,"station_lng":125.004},"11.30784,124.76903":{"nearest_station":"Tacloban","distance_km":26.56,"station_lat":11.245,"station_lng":125.004},"10.33207,124.83932":{"nearest_station":"Maasin","distance_km":22.36,"station_lat":10.131,"station_lng":124.844},"10.68857,124.83802":{"nearest_station":"Maasin","distance_km":62.0,"station_lat":10.131,"station_lng":124.844},"10.96389,124.85499":{"nearest_station":"Tacloban","distance_km":35.23,"station_lat":11.245,"station_lng":125.004},"11.48434,124.36393":{"nearest_station":"Catbalogan","distance_km":65.4,"station_lat":11.775,"station_lng":124.886},"11.25007,124.60421":{"nearest_station":"Tacloban","distance_km":43.6,"station_lat":11.245,"station_lng":125.004},"11.2368,124.6931":{"nearest_station":"Tacloban","distance_km":33.92,"station_lat":11.245,"station_lng":125.004},"11.06136,124.86273":{"nearest_station":"Tacloban","distance_km":25.58,"station_lat":11.245,"station_lng":125.004},"10.96328,125.00848":{"nearest_station":"Tacloban","distance_km":31.33,"station_lat":11.245,"station_lng":125.004},"10.39594,124.82303":{"nearest_station":"Maasin","distance_km":29.55,"station_lat":10.131,"station_lng":124.844},"10.45543,124.81323":{"nearest_station":"Maasin","distance_km":36.23,"station_lat":10.131,"station_lng":124.844},"10.51964,124.84216":{"nearest_station":"Maasin","distance_km":43.22,"station_lat":10.131,"station_lng":124.844},"10.9403,124.45969":{"nearest_station":"Tacloban","distance_km":68.38,"station_lat":11.245,"station_lng":125.004},"11.162,124.76555":{"nearest_station":"Tacloban","distance_km":27.6,"station_lat":11.245,"station_lng":125.004},"10.76396,124.9247":{"nearest_station":"Tacloban","distance_km":54.19,"station_lat":11.245,"station_lng":125.004},"10.9813,124.9613":{"nearest_station":"Tacloban","distance_km":29.69,"station_lat":11.245,"station_lng":125.004},"11.16897,124.56401":{"nearest_station":"Tacloban","distance_km":48.73,"station_lat":11.245,"station_lng":125.004},"10.88075,124.90279":{"nearest_station":"Tacloban","distance_km":41.98,"station_lat":11.245,"station_lng":125.004},"11.34942,124.55091":{"nearest_station":"Tacloban","distance_km":50.75,"station_lat":11.245,"station_lng":125.004},"10.8248,124.93807":{"nearest_station":"Tacloban","distance_km":47.27,"station_lat":11.245,"station_lng":125.004},"10.59097,124.98676":{"nearest_station":"Maasin","distance_km":53.48,"station_lat":10.131,"station_lng":124.844},"11.12402,124.46826":{"nearest_station":"Tacloban","distance_km":59.97,"station_lat":11.245,"station_lng":125.004},"10.26515,124.82472":{"nearest_station":"Maasin","distance_km":15.06,"station_lat":10.131,"station_lng":124.844},"10.88315,124.98775":{"nearest_station":"Tacloban","distance_km":40.27,"station_lat":11.245,"station_lng":125.004},"10.96365,124.51025":{"nearest_station":"Tacloban","distance_km":62.3,"station_lat":11.245,"station_lng":125.004},"11.05525,124.63571":{"nearest_station":"Tacloban","distance_km":45.38,"station_lat":11.245,"station_lng":125.004},"11.14566,124.96978":{"nearest_station":"Tacloban","distance_km":11.66,"station_lat":11.245,"station_lng":125.004},"11.01139,124.38416":{"nearest_station":"Tacloban","distance_km":72.44,"station_lat":11.245,"station_lng":125.004},"11.42455,124.35636":{"nearest_station":"Catbalogan","distance_km":69.62,"station_lat":11.775,"station_lng":124.886},"11.31841,124.8437":{"nearest_station":"Tacloban","distance_km":19.29,"station_lat":11.245,"station_lng":125.004},"11.18866,124.93617":{"nearest_station":"Tacloban","distance_km":9.69,"station_lat":11.245,"station_lng":125.004},"11.30927,124.40396":{"nearest_station":"Tacloban","distance_km":65.82,"station_lat":11.245,"station_lng":125.004},"11.04415,124.94709":{"nearest_station":"Tacloban","distance_km":23.18,"station_lat":11.245,"station_lng":125.004},"11.27235,124.95522":{"nearest_station":"Tacloban","distance_km":6.13,"station_lat":11.245,"station_lng":125.004},"11.08463,124.99075":{"nearest_station":"Tacloban","distance_km":17.89,"station_lat":11.245,"station_lng":125.004},"11.03688,125.02029":{"nearest_station":"Tacloban","distance_km":23.21,"station_lat":11.245,"station_lng":125.004},"11.24755,124.75699":{"nearest_station":"Tacloban","distance_km":26.94,"station_lat":11.245,"station_lng":125.004},"11.19565,124.43468":{"nearest_station":"Tacloban","distance_km":62.34,"station_lat":11.245,"station_lng":125.004},"12.50479,124.31395":{"nearest_station":"Catarman","distance_km":35.07,"station_lat":12.501,"station_lng":124.637},"12.61679,124.43203":{"nearest_station":"Catarman","distance_km":25.7,"station_lat":12.501,"station_lng":124.637},"12.41088,124.53638":{"nearest_station":"Catarman","distance_km":14.82,"station_lat":12.501,"station_lng":124.637},"12.42815,124.16235":{"nearest_station":"Juban","distance_km":50.52,"station_lat":12.849,"station_lng":123.987},"12.42897,124.63772":{"nearest_station":"Catarman","distance_km":8.01,"station_lat":12.501,"station_lng":124.637},"12.40038,125.07712":{"nearest_station":"Catarman","distance_km":49.08,"station_lat":12.501,"station_lng":124.637},"12.38998,125.25849":{"nearest_station":"Catarman","distance_km":68.6,"station_lat":12.501,"station_lng":124.637},"12.48324,125.07485":{"nearest_station":"Catarman","distance_km":47.58,"station_lat":12.501,"station_lng":124.637},"12.31146,125.28294":{"nearest_station":"Catarman","distance_km":73.25,"station_lat":12.501,"station_lng":124.637},"12.30234,125.02659":{"nearest_station":"Catarman","distance_km":47.73,"station_lat":12.501,"station_lng":124.637},"12.58083,124.37722":{"nearest_station":"Catarman","distance_km":29.56,"station_lat":12.501,"station_lng":124.637},"12.32132,124.65932":{"nearest_station":"Catarman","distance_km":20.13,"station_lat":12.501,"station_lng":124.637},"12.45071,125.20784":{"nearest_station":"Catarman","distance_km":62.23,"station_lat":12.501,"station_lng":124.637},"12.41127,124.7762":{"nearest_station":"Catarman","distance_km":18.11,"station_lat":12.501,"station_lng":124.637},"12.5191,125.13689":{"nearest_station":"Catarman","distance_km":54.3,"station_lat":12.501,"station_lng":124.637},"12.45874,124.93923":{"nearest_station":"Catarman","distance_km":33.15,"station_lat":12.501,"station_lng":124.637},"12.50131,124.43692":{"nearest_station":"Catarman","distance_km":21.72,"station_lat":12.501,"station_lng":124.637},"12.41012,124.26285":{"nearest_station":"Catarman","distance_km":41.86,"station_lat":12.501,"station_lng":124.637},"12.34787,124.39365":{"nearest_station":"Catarman","distance_km":31.44,"station_lat":12.501,"station_lng":124.637},"12.58128,124.4816":{"nearest_station":"Catarman","distance_km":19.08,"station_lat":12.501,"station_lng":124.637},"12.46227,124.87689":{"nearest_station":"Catarman","distance_km":26.4,"station_lat":12.501,"station_lng":124.637},"12.39694,124.02417":{"nearest_station":"Masbate","distance_km":43.56,"station_lat":12.371,"station_lng":123.624},"12.28129,124.86474":{"nearest_station":"Catarman","distance_km":34.77,"station_lat":12.501,"station_lng":124.637},"12.42654,124.40439":{"nearest_station":"Catarman","distance_km":26.58,"station_lat":12.501,"station_lng":124.637},"11.92782,124.31133":{"nearest_station":"Catbalogan","distance_km":64.81,"station_lat":11.775,"station_lng":124.886},"11.39367,125.15202":{"nearest_station":"Tacloban","distance_km":23.1,"station_lat":11.245,"station_lng":125.004},"12.19267,124.58862":{"nearest_station":"Catarman","distance_km":34.69,"station_lat":12.501,"station_lng":124.637},"11.61968,125.08671":{"nearest_station":"Catbalogan","distance_km":27.85,"station_lat":11.775,"station_lng":124.886},"11.82814,124.70359":{"nearest_station":"Catbalogan","distance_km":20.71,"station_lat":11.775,"station_lng":124.886},"11.68627,124.75444":{"nearest_station":"Catbalogan","distance_km":17.39,"station_lat":11.775,"station_lng":124.886},"12.0706,124.82349":{"nearest_station":"Catbalogan","distance_km":33.56,"station_lat":11.775,"station_lng":124.886},"11.72288,125.17939":{"nearest_station":"Borongan","distance_km":30.23,"station_lat":11.608,"station_lng":125.431},"11.8477,124.96634":{"nearest_station":"Catbalogan","distance_km":11.91,"station_lat":11.775,"station_lng":124.886},"11.20585,125.21846":{"nearest_station":"Tacloban","distance_km":23.79,"station_lat":11.245,"station_lng":125.004},"12.19367,125.0071":{"nearest_station":"Catbalogan","distance_km":48.38,"station_lat":11.775,"station_lng":124.886},"11.8806,125.01627":{"nearest_station":"Catbalogan","distance_km":18.41,"station_lat":11.775,"station_lng":124.886},"11.96547,124.75525":{"nearest_station":"Catbalogan","distance_km":25.51,"station_lat":11.775,"station_lng":124.886},"11.87305,125.13073":{"nearest_station":"Catbalogan","distance_km":28.78,"station_lat":11.775,"station_lng":124.886},"11.55829,125.07962":{"nearest_station":"Catbalogan","distance_km":32.02,"station_lat":11.775,"station_lng":124.886},"11.98317,124.90372":{"nearest_station":"Catbalogan","distance_km":23.23,"station_lat":11.775,"station_lng":124.886},"12.06577,125.04541":{"nearest_station":"Catbalogan","distance_km":36.69,"station_lat":11.775,"station_lng":124.886},"11.6997,125.02153":{"nearest_station":"Catbalogan","distance_km":16.97,"station_lat":11.775,"station_lng":124.886},"12.06183,124.71452":{"nearest_station":"Catbalogan","distance_km":36.95,"station_lat":11.775,"station_lng":124.886},"11.42479,124.99426":{"nearest_station":"Tacloban","distance_km":20.02,"station_lat":11.245,"station_lng":125.004},"11.92608,124.4346":{"nearest_station":"Catbalogan","distance_km":51.92,"station_lat":11.775,"station_lng":124.886},"12.06196,124.19006":{"nearest_station":"Catarman","distance_km":68.86,"station_lat":12.501,"station_lng":124.637},"11.50995,124.84692":{"nearest_station":"Catbalogan","distance_km":29.78,"station_lat":11.775,"station_lng":124.886},"11.86998,124.78904":{"nearest_station":"Catbalogan","distance_km":14.93,"station_lat":11.775,"station_lng":124.886},"11.59237,124.87895":{"nearest_station":"Catbalogan","distance_km":20.32,"station_lat":11.775,"station_lng":124.886},"11.61949,124.86134":{"nearest_station":"Catbalogan","distance_km":17.5,"station_lat":11.775,"station_lng":124.886},"10.29863,125.21505":{"nearest_station":"Maasin","distance_km":44.68,"station_lat":10.131,"station_lng":124.844},"10.37132,124.92789":{"nearest_station":"Maasin","distance_km":28.25,"station_lat":10.131,"station_lng":124.844},"10.39685,125.14555":{"nearest_station":"Maasin","distance_km":44.3,"station_lat":10.131,"station_lng":124.844},"10.34431,125.22944":{"nearest_station":"Maasin","distance_km":48.39,"station_lat":10.131,"station_lng":124.844},"10.33158,125.0683":{"nearest_station":"Maasin","distance_km":33.16,"station_lat":10.131,"station_lng":124.844},"10.13301,125.16362":{"nearest_station":"Maasin","distance_km":34.99,"station_lat":10.131,"station_lng":124.844},"9.93055,125.0716":{"nearest_station":"Maasin","distance_km":33.43,"station_lat":10.131,"station_lng":124.844},"10.18448,124.85346":{"nearest_station":"Maasin","distance_km":6.04,"station_lat":10.131,"station_lng":124.844},"10.09229,124.94904":{"nearest_station":"Maasin","distance_km":12.28,"station_lat":10.131,"station_lng":124.844},"10.17867,124.96047":{"nearest_station":"Maasin","distance_km":13.81,"station_lat":10.131,"station_lng":124.844},"10.07927,125.0":{"nearest_station":"Maasin","distance_km":18.02,"station_lat":10.131,"station_lng":124.844},"9.97588,125.24108":{"nearest_station":"Maasin","distance_km":46.77,"station_lat":10.131,"station_lng":124.844},"10.30602,125.12133":{"nearest_station":"Maasin","distance_km":36.05,"station_lat":10.131,"station_lng":124.844},"10.0728,125.16559":{"nearest_station":"Maasin","distance_km":35.79,"station_lat":10.131,"station_lng":124.844},"10.2719,125.194":{"nearest_station":"Maasin","distance_km":41.38,"station_lat":10.131,"station_lng":124.844},"9.98949,125.25947":{"nearest_station":"Maasin","distance_km":48.13,"station_lat":10.131,"station_lng":124.844},"10.52044,125.12944":{"nearest_station":"Maasin","distance_km":53.39,"station_lat":10.131,"station_lng":124.844},"10.45653,124.99797":{"nearest_station":"Maasin","distance_km":39.92,"station_lat":10.131,"station_lng":124.844},"10.27817,124.94292":{"nearest_station":"Maasin","distance_km":19.62,"station_lat":10.131,"station_lng":124.844}};

function getNearestStation(lat: number, lng: number): NearestStationInfo | null {
  const key = `${parseFloat(lat.toFixed(5))},${parseFloat(lng.toFixed(5))}`;
  return NEAREST_STATION_LOOKUP[key] ?? null;
}

// ─── Disclaimer Data ──────────────────────────────────────────────────────────
const STATION_DISCLAIMERS: Record<string, StationDisclaimer> = {
  APARRI: { stationName: "Aparri", disclaimer: "Coastal station near the mouth of the Cagayan River and adjacent to the West Philippine Sea; strongly influenced by maritime winds and coastal weather systems." },
  BALER: { stationName: "Baler Radar", disclaimer: "Located in a coastal and mountainous area of Aurora; weather patterns may be affected by both sea influence and orographic (mountain-induced) rainfall." },
  BASCO: { stationName: "Basco Radar", disclaimer: "Situated in Batanes and surrounded by open sea; highly exposed to oceanic winds, tropical cyclones, and maritime atmospheric conditions." },
  BORONGAN: { stationName: "Borongan", disclaimer: "Coastal station facing the Pacific Ocean; directly exposed to typhoons and easterly weather disturbances." },
  "BORONGAN CITY": { stationName: "Borongan", disclaimer: "Coastal station facing the Pacific Ocean; directly exposed to typhoons and easterly weather disturbances." },
  "SCIENCE CITY OF MUNOZ": { stationName: "CLSU (Central Luzon State University)", disclaimer: "Inland station in Nueva Ecija; influenced more by continental climate conditions and surrounding agricultural plains." },
  CALAYAN: { stationName: "Calayan", disclaimer: "Island station surrounded by open waters; subject to strong marine winds and rapidly changing weather conditions." },
  CASIGURAN: { stationName: "Casiguran", disclaimer: "Coastal station facing the Pacific Ocean; exposed to monsoon surges and tropical cyclones." },
  CATARMAN: { stationName: "Catarman", disclaimer: "Located in Northern Samar near coastal areas; influenced by maritime air masses and frequent rainfall systems." },
  CATBALOGAN: { stationName: "Catbalogan", disclaimer: "Coastal station in Samar along Maqueda Bay; affected by sea breeze circulation and nearby coastal systems." },
  ANGELES: { stationName: "Clark", disclaimer: "Inland station with moderate elevation; influenced by surrounding plains and localized convective rainfall." },
  SUBIC: { stationName: "Cubi Point", disclaimer: "Coastal station in Subic Bay area; affected by sea breeze patterns and maritime conditions." },
  DAET: { stationName: "Daet", disclaimer: "Coastal station near Lamon Bay; exposed to Pacific weather systems and heavy rainfall during typhoon events." },
  GUIUAN: { stationName: "Guiuan", disclaimer: "Located at the southeastern tip of Samar facing the Pacific Ocean; highly exposed to direct landfall of tropical cyclones." },
  IBA: { stationName: "Iba", disclaimer: "Coastal station along the West Philippine Sea; influenced by monsoon winds and coastal atmospheric circulation." },
  ITBAYAT: { stationName: "Itbayat", disclaimer: "Northernmost island station surrounded by open sea; highly exposed to strong winds and ocean-driven weather systems." },
  JUBAN: { stationName: "Juban", disclaimer: "Inland station in Sorsogon but near coastal influences; may experience both terrain and maritime weather effects." },
  "LEGAZPI CITY": { stationName: "Legazpi", disclaimer: "Coastal station near Albay Gulf and at the foot of Mayon Volcano; influenced by both marine conditions and local topography." },
  MAASIN: { stationName: "Maasin", disclaimer: "Coastal station in Southern Leyte; affected by sea breeze circulation and nearby mountainous terrain." },
  "MASBATE CITY": { stationName: "Masbate", disclaimer: "Island province station surrounded by sea; influenced by maritime climate conditions." },
  "TACLOBAN CITY": { stationName: "Tacloban", disclaimer: "Coastal station along San Pedro Bay; highly influenced by coastal weather systems and storm surges." },
  "TUGUEGARAO CITY": { stationName: "Tuguegarao", disclaimer: "Inland valley station in Cagayan; characterized by continental heat conditions and limited direct maritime influence." },
  VIRAC: { stationName: "Virac Synop", disclaimer: "Island station in Catanduanes facing the Pacific Ocean; highly exposed to typhoons and strong monsoon systems." },
};

const GENERAL_DISCLAIMER =
  "Due to these geographic and environmental characteristics, weather data from each station may not fully represent conditions in areas with different terrain, elevation, or distance from large bodies of water. Users are advised to interpret system outputs with consideration of station location and environmental context.";

function getStationDisclaimer(municipality: string): StationDisclaimer | null {
  const upper = municipality.toUpperCase();
  if (STATION_DISCLAIMERS[upper]) return STATION_DISCLAIMERS[upper];
  for (const key of Object.keys(STATION_DISCLAIMERS)) {
    if (upper.includes(key) || key.includes(upper)) return STATION_DISCLAIMERS[key];
  }
  return null;
}

// ─── Map Component (client-only) ──────────────────────────────────────────────
function WeatherMap({ onStationClick }: { onStationClick: (s: Station) => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // Don't initialize if ref is not available
    if (!mapRef.current) return;

    // Dynamically import Leaflet (avoids SSR issues)
    import("leaflet").then((L) => {
      // Check again after async import
      if (!mapRef.current) return;
      
      // If map instance already exists, don't reinitialize
      if (mapInstanceRef.current) return;

      // Fix default icon paths
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current, {
        center: [12.8797, 121.774],
        zoom: 6,
        zoomControl: true,
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Custom icon
      const blueIcon = L.divIcon({
        className: "",
        html: `<div style="
          width:10px;height:10px;
          background:#2563eb;
          border:2px solid white;
          border-radius:50%;
          box-shadow:0 1px 4px rgba(0,0,0,0.4);
          cursor:pointer;
        "></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });

      const hasDisclaimer = L.divIcon({
        className: "",
        html: `<div style="
          width:12px;height:12px;
          background:#f59e0b;
          border:2px solid white;
          border-radius:50%;
          box-shadow:0 1px 6px rgba(0,0,0,0.5);
          cursor:pointer;
        "></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });

      // Clear previous markers
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      STATIONS.forEach((station) => {
        const disc = getStationDisclaimer(station.municipality);
        const marker = L.marker([station.lat, station.lng], {
          icon: disc ? hasDisclaimer : blueIcon,
        });
        marker.bindTooltip(
          `<strong>${station.municipality}</strong><br/>${station.province}`,
          { direction: "top", offset: [0, -6] }
        );
        marker.on("click", () => onStationClick(station));
        marker.addTo(map);
        markersRef.current.push(marker);
      });

      mapInstanceRef.current = map;
    });

    return () => {
      // Clean up markers
      markersRef.current.forEach(m => {
        try {
          m.remove();
        } catch (e) {
          // Ignore errors during cleanup
        }
      });
      markersRef.current = [];

      // Clean up map
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // Ignore errors during cleanup
        }
        mapInstanceRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run once on mount

  // Update marker click handlers when onStationClick changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach((marker, index) => {
      const station = STATIONS[index];
      marker.off("click");
      marker.on("click", () => onStationClick(station));
    });
  }, [onStationClick]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}

// ─── Main Page Component ───────────────────────────────────────────────────────
export default function PhilippinesWeatherStationPage() {
  const [disclaimerCollapsed, setDisclaimerCollapsed] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const handleStationClick = useCallback((station: Station) => {
    setSelectedStation(station);
    setPanelOpen(true);
  }, []);

  const disclaimer = selectedStation ? getStationDisclaimer(selectedStation.municipality) : null;
  const nearestStation = selectedStation ? getNearestStation(selectedStation.lat, selectedStation.lng) : null;
  const stationLabel = disclaimer?.stationName ?? selectedStation?.municipality ?? "";

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
      />

      <div style={{ position: "relative", width: "100%", height: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

        {/* ── Map (full screen) ── */}
        <WeatherMap onStationClick={handleStationClick} />

        {/* ── General Disclaimer Panel – Upper Left ── */}
        <div style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 1000,
          width: 320,
          background: "rgba(255,255,255,0.97)",
          borderLeft: "4px solid #1d4ed8",
          borderRadius: 8,
          boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
          overflow: "hidden",
        }}>
          {/* Header */}
          <button
            onClick={() => setDisclaimerCollapsed(v => !v)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 14px",
              background: "#1d4ed8",
              color: "white",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 12, letterSpacing: 0.3 }}>
              ⚠️ Weather Station Geographic Disclaimer
            </span>
            <span style={{
              fontSize: 16,
              transition: "transform 0.25s",
              display: "inline-block",
              transform: disclaimerCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
            }}>▼</span>
          </button>

          {/* Body */}
          {!disclaimerCollapsed && (
            <div style={{ padding: "10px 14px", maxHeight: 220, overflowY: "auto" }}>
              <p style={{ margin: "0 0 8px 0", fontSize: 11.5, color: "#374151", lineHeight: 1.6 }}>
                The meteorological data used in this system are influenced by the physical surroundings of each weather station. Recorded parameters such as rainfall, temperature, wind speed, and humidity may reflect localized environmental conditions based on proximity to seas, elevation, terrain, and land cover.
              </p>
              <div style={{
                background: "#eff6ff",
                borderRadius: 5,
                padding: "7px 10px",
                fontSize: 11,
                color: "#1d4ed8",
                display: "flex",
                alignItems: "flex-start",
                gap: 6,
              }}>
                <span>🗺️</span>
                <span>
                  <strong style={{ color: "#f59e0b" }}>Amber markers</strong> weather stations have specific geographic disclaimers.{" "}
                  <strong style={{ color: "#2563eb" }}>Blue markers</strong> are municipalities. Click any marker for details.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Station Info Side Panel – Right ── */}
        <div style={{
          position: "absolute",
          top: 12,
          right: panelOpen ? 12 : -420,
          zIndex: 1000,
          width: 380,
          background: "rgba(255,255,255,0.98)",
          borderLeft: "4px solid #16a34a",
          borderRadius: 8,
          boxShadow: "-4px 4px 20px rgba(0,0,0,0.18)",
          maxHeight: "calc(100vh - 24px)",
          overflowY: "auto",
          transition: "right 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}>
          {/* Panel Header */}
          <div style={{
            position: "sticky",
            top: 0,
            background: "#16a34a",
            color: "white",
            padding: "10px 14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 1,
          }}>
            <span style={{ fontWeight: 700, fontSize: 13 }}>
              {stationLabel || "Station Information"}
            </span>
            <button
              onClick={() => setPanelOpen(false)}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "white",
                borderRadius: 4,
                width: 26,
                height: 26,
                cursor: "pointer",
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >✕</button>
          </div>

          {/* Panel Content */}
          {selectedStation && (
            <div style={{ padding: "14px 16px" }}>
              {/* Location Info */}
              <div style={{
                background: "#f0f9ff",
                borderRadius: 6,
                padding: "10px 13px",
                marginBottom: 14,
              }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1d4ed8", marginBottom: 8 }}>
                  {stationLabel}
                </div>
                <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                  <tbody>
                    {[
                      ["Municipality", selectedStation.municipality],
                      ["Province", selectedStation.province],
                      ["Region", `Region ${selectedStation.region}`],
                      ["Coordinates", `${selectedStation.lat.toFixed(5)}, ${selectedStation.lng.toFixed(5)}`],
                    ].map(([label, value]) => (
                      <tr key={label}>
                        <td style={{ padding: "3px 0", color: "#6b7280", fontWeight: 600, width: 100, verticalAlign: "top" }}>{label}</td>
                        <td style={{ padding: "3px 0", color: "#111827" }}>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Nearest Weather Station */}
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>
                Nearest Weather Station
              </div>
              {nearestStation ? (
                <div style={{
                  background: "#f5f3ff",
                  borderLeft: "3px solid #7c3aed",
                  borderRadius: "0 5px 5px 0",
                  padding: "9px 12px",
                  marginBottom: 14,
                  fontSize: 12,
                  color: "#374151",
                  lineHeight: 1.6,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#5b21b6", marginBottom: 3 }}>
                        {nearestStation.nearest_station}
                      </div>
                      <div style={{ fontSize: 11.5, color: "#6b7280" }}>
                        Coords: {nearestStation.station_lat.toFixed(3)}, {nearestStation.station_lng.toFixed(3)}
                      </div>
                    </div>
                    <div style={{
                      background: "#7c3aed",
                      color: "white",
                      borderRadius: 20,
                      padding: "3px 10px",
                      fontSize: 12,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}>
                      {nearestStation.distance_km < 1
                        ? `< 1 km`
                        : `${nearestStation.distance_km.toFixed(1)} km`}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: "#f9fafb",
                  borderLeft: "3px solid #d1d5db",
                  borderRadius: "0 5px 5px 0",
                  padding: "9px 12px",
                  marginBottom: 14,
                  fontSize: 12,
                  color: "#9ca3af",
                  fontStyle: "italic",
                }}>
                  No nearest station data available.
                </div>
              )}

              {/* Station-specific disclaimer */}
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>
                Station Geographic Note
              </div>
              <div style={{
                background: disclaimer ? "#fffbeb" : "#f9fafb",
                borderLeft: `3px solid ${disclaimer ? "#f59e0b" : "#d1d5db"}`,
                borderRadius: "0 5px 5px 0",
                padding: "9px 12px",
                marginBottom: 14,
                fontSize: 12,
                color: disclaimer ? "#374151" : "#9ca3af",
                lineHeight: 1.6,
                fontStyle: disclaimer ? "normal" : "italic",
              }}>
                {disclaimer
                  ? disclaimer.disclaimer
                  : "No specific geographic disclaimer is available for this station."}
              </div>

              {/* General disclaimer */}
              <div style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                padding: "10px 13px",
                fontSize: 11,
                color: "#6b7280",
                lineHeight: 1.55,
              }}>
                <div style={{ fontWeight: 700, color: "#374151", marginBottom: 5, fontSize: 11.5 }}>
                  ⚠️ General Disclaimer
                </div>
                {GENERAL_DISCLAIMER}
              </div>
            </div>
          )}
        </div>

        {/* ── Legend – Bottom Left ── */}
        <div style={{
          position: "absolute",
          bottom: 28,
          left: 12,
          zIndex: 1000,
          background: "rgba(255,255,255,0.95)",
          borderRadius: 7,
          padding: "8px 13px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
          fontSize: 11,
          color: "#374151",
        }}>
          <div style={{ fontWeight: 700, marginBottom: 5, fontSize: 11.5 }}>Legend</div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
            <div style={{ width: 12, height: 12, background: "#f59e0b", borderRadius: "50%", border: "2px solid white", boxShadow: "0 0 3px rgba(0,0,0,0.3)" }} />
            <span>Weather Station</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 10, height: 10, background: "#2563eb", borderRadius: "50%", border: "2px solid white", boxShadow: "0 0 3px rgba(0,0,0,0.3)" }} />
            <span>Municipalities</span>
          </div>
        </div>
      </div>
    </>
  );
}