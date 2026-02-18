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

  useEffect(() => {
    // Don't initialize if map already exists or ref is not available
    if (!mapRef.current) return;
    
    // If map instance already exists, remove it first
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Dynamically import Leaflet (avoids SSR issues)
    import("leaflet").then((L) => {
      // Check again after async import
      if (!mapRef.current) return;
      
      // Double-check map instance doesn't exist
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
      });

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
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
                  <strong style={{ color: "#f59e0b" }}>Amber markers</strong> have specific geographic disclaimers.{" "}
                  <strong style={{ color: "#2563eb" }}>Blue markers</strong> are regular stations. Click any marker for details.
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
              📍 {stationLabel || "Station Information"}
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

              {/* Station-specific disclaimer */}
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>
                📌 Station Geographic Note
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
            <span>Station with geographic disclaimer</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 10, height: 10, background: "#2563eb", borderRadius: "50%", border: "2px solid white", boxShadow: "0 0 3px rgba(0,0,0,0.3)" }} />
            <span>Standard weather station</span>
          </div>
        </div>
      </div>
    </>
  );
}