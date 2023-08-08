import React, { useState, useEffect } from 'react';
import { Row, Col } from "react-bootstrap";
import AWBCalculator from './AWBCalculator';
import Router from 'next/router';
import { useSelector } from 'react-redux';
import CSVReader from 'react-csv-reader'

const Main = ({sessionData}) => {

  let clients = [ //Only Clients
    {
        "PartyTypeId": "1",
        "code": "1",
        "name": "BILAL AND CO",
        "person1": "",
        "zip": "75340",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "NULL",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "4",
        "name": "PACIFIC FREIGHT SYSTEMS (PVT) LTD",
        "person1": "",
        "zip": "75100",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "NULL",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "5",
        "name": "A. L. GARMENTS",
        "person1": "C/O Amir Nisar ( cargolinkers)",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "0331 0202110",
        "mobile2": "",
        "infoMail": "selfkhurram@gmail.com",
        "website": "5270",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "6",
        "name": "A.H TRADERS",
        "person1": "NTN: 3384881-5",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5271",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "7",
        "name": "A.I.R INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5272",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "8",
        "name": "A.J WORLDWIDE SERVICE PAKISTAN (PVT) LTD",
        "person1": "HINA KIYANI",
        "zip": "",
        "telephone1": "92- 21-34383027",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "exports1@ajwwpk.com",
        "website": "5273",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "9",
        "name": "A.O ENTERPRISES",
        "person1": "OSAMA",
        "zip": "",
        "telephone1": "+92 335 929 6969",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "'OSAMA MUHAMMAD SIDDIQ' <osama@ao-enterprises.com>",
        "website": "5274",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "10",
        "name": "AFRAZ KNIT & STITCH PVT LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5275",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "11",
        "name": "AGRO HUB INTERNATIONAL (PVT) LTD",
        "person1": "ABDUL REHMAN",
        "zip": "",
        "telephone1": "92-21-34325161-3",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "ABDUL REHMAN <arehman.agrohub@gmail.com>",
        "website": "5276",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "12",
        "name": "AL AMIN EXPORT",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5277",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "13",
        "name": "AL KARAM TOWEL INDUSTRIES PVT LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5278",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "14",
        "name": "AL-HAMDOLILLAH EXPORTS",
        "person1": "ASRAR AHMAD",
        "zip": "",
        "telephone1": "041-8777606",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "041-8777607",
        "infoMail": "asrar.buttz@gmail.com",
        "website": "5279",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "15",
        "name": "ALI TRADING COMPANY (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5280",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "17",
        "name": "AMANIA SUPPORT SERVICES SMC (PVT) LTD",
        "person1": "KONAIN RAZA",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "konainraza_503@outlook.com",
        "website": "5281",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "20",
        "name": "ARMS SNACKS FOODS",
        "person1": "",
        "zip": "",
        "telephone1": "-6978791",
        "telephone2": "",
        "mobile1": "-8275930",
        "mobile2": "",
        "infoMail": "BD@SBRNCO.COM,",
        "website": "5282",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "21",
        "name": "ARSHAD CORPORATION (PVT)LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5283",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "22",
        "name": "ARTISTIC DENIM MILLS LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5284",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "23",
        "name": "ARTISTIC FABRIC MILLS (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5285",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "24",
        "name": "ARTISTIC GARMENTS INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5286",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "25",
        "name": "AYOOB TEX.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5287",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "26",
        "name": "AYOOB TEXTILE MILLS LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5288",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "27",
        "name": "AZ APPAREL CHAK",
        "person1": "Md.Yasir",
        "zip": "",
        "telephone1": "+92 300 6698831",
        "telephone2": "",
        "mobile1": "+92 300 2031752",
        "mobile2": "",
        "infoMail": "",
        "website": "5289",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "28",
        "name": "AZGARD NINE LIMITED",
        "person1": "Waqas Mansoor",
        "zip": "",
        "telephone1": "+92 (0) 4235384081-2",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "+92 (0) 4235384090",
        "infoMail": "Waqas.Mansoor@azgard9.com",
        "website": "5290",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "29",
        "name": "BARAKA TEXTILES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5291",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "30",
        "name": "BARI TEXTILE MILLS (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5292",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "31",
        "name": "BATLASONS,",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5293",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "33",
        "name": "BESTWAY CEMENT LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5294",
        "operations": "Sea Import, Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "34",
        "name": "BHANERO TEXTILE MILLS LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5295",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "36",
        "name": "CAAV GROUP",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6677",
        "operations": "Sea Import, Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "37",
        "name": "CAMBRIDGE GARMENT INDUSTRIES(PVT) LTD.",
        "person1": "YOUSUF",
        "zip": "",
        "telephone1": "(021) 32587531",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "'Yousuf' <yousuf@cambridge.com.pk>",
        "website": "5296",
        "operations": "Sea Import, Sea Export, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "38",
        "name": "CARE LOGISTICS PVT LTD",
        "person1": "Habibullah Khan",
        "zip": "",
        "telephone1": "92 213 4387293 & 94 & 95",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "92 213 4387297",
        "infoMail": "cs@carelogistics.com.pk",
        "website": "5297",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "40",
        "name": "CENTURY ENGINEERING INDUSTRIES (PVT)LTD.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5298",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "41",
        "name": "CHAWALA ENTERPRISES TEXTILES MANUFA",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5299",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "42",
        "name": "CONVENIENCE FOOD INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5300",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "43",
        "name": "CRESCENT COTTON MILLS LIMITED",
        "person1": "MUHAMMAD SALEEM",
        "zip": "",
        "telephone1": "0092-41-8750363/4",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "mailto:saleem@askshipping.com",
        "website": "5301",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "44",
        "name": "D.K INDUSTRIES (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5302",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "47",
        "name": "DIAMOND FABRICS LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5303",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "48",
        "name": "DOUBLE \"A\" INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5304",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "50",
        "name": "EMBASSY OF DENMARK",
        "person1": "",
        "zip": "",
        "telephone1": "Tel: +92 (51) 209 9800",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "Fax: +92 (51) 282 3483",
        "infoMail": "isbamb@um.dk",
        "website": "5306",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "51",
        "name": "EUR LOGISTICS SERVICES PAKISTAN PRIVATE LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5307",
        "operations": "Sea Import, Sea Export, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "53",
        "name": "FAZAL & CO.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5308",
        "operations": "Sea Import, Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "54",
        "name": "FEROZE1888 MILLS LTD",
        "person1": "",
        "zip": "",
        "telephone1": "+92 (21) 32413888",
        "telephone2": "",
        "mobile1": "0334-2413888",
        "mobile2": "32414605",
        "infoMail": "",
        "website": "5309",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "55",
        "name": "FINE GROUP INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5310",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "56",
        "name": "FIRST AMERICAN CORPORATION (PVT) LTD",
        "person1": "Zain ul Hassan",
        "zip": "",
        "telephone1": "0340-0481245",
        "telephone2": "",
        "mobile1": "052-6526284-85",
        "mobile2": "",
        "infoMail": "",
        "website": "5311",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "57",
        "name": "FOURTEX APPARELS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "kashif.jamil@logisticsservices.com.pk",
        "website": "5312",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "58",
        "name": "FULLMOON ENTERPRISES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5313",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "59",
        "name": "G.I.ENTERPRISES",
        "person1": "ALI ZAIDI",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "9.22E+11",
        "mobile2": "",
        "infoMail": "Ali Zaidi <alizaidi@gienterprises.com.pk>",
        "website": "5314",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "60",
        "name": "GLOBAL TECHNOLOGIES & SERVICES",
        "person1": "Abeeda Siddiqui",
        "zip": "",
        "telephone1": "9221 34389077",
        "telephone2": "",
        "mobile1": "0331-2333031",
        "mobile2": "",
        "infoMail": "cis@globaltech.biz",
        "website": "5315",
        "operations": "Sea Import, Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "61",
        "name": "GUJRANWAL FOOD INDUSTRIES PVT LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5316",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "62",
        "name": "H & H MARINE PRODUCTS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5317",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "63",
        "name": "HAMID LEATHER (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5318",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "64",
        "name": "HAYAT KIMYA PAKISTAN (PRIVATE) LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "N/A",
        "mobile2": "",
        "infoMail": "'Sajid Bashir' <sbashir@hayatkimya.pk>",
        "website": "5319",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "65",
        "name": "HEALTHY SALT INTERNATIONAL",
        "person1": "Tahira Khuram",
        "zip": "",
        "telephone1": "42 35153596",
        "telephone2": "",
        "mobile1": "+92 301 7112927,",
        "mobile2": "",
        "infoMail": "tahira@healthysaltintl.com",
        "website": "5320",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "66",
        "name": "HERBION PAKISTAN (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5321",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "67",
        "name": "HOM QUALITY FOODS (PVT) LTD.",
        "person1": "J. Hassan",
        "zip": "",
        "telephone1": "(021) 34388293",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "sales.operation@habiboil.com",
        "website": "5322",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "68",
        "name": "HUB-PAK SALT REFINERY",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5323",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "69",
        "name": "HUSSAIN LEATHER CRAFT",
        "person1": "SHAHID MEHMOOD",
        "zip": "",
        "telephone1": "2135061638",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5324",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "70",
        "name": "INDUS HOME LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5325",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "72",
        "name": "INTERNATIONAL BUSINESS HUB.",
        "person1": "NTN NO: 7479828-0",
        "zip": "",
        "telephone1": "0092-3138877733",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "INFO@IBHPVT.COM",
        "website": "5326",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "73",
        "name": "INTERNATIONAL TEXTILE LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5327",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "75",
        "name": "J.B CORPORATION",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5328",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "76",
        "name": "JAFFSON ENTERPRISES (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5329",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "77",
        "name": "JAWA INDUSTRY",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5330",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "78",
        "name": "JB INDUSTRIES (GARMENT DIVISION)",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5331",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "79",
        "name": "JK SPINNING MILLS LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5332",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "80",
        "name": "JUBILEE APPAREL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6058",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "81",
        "name": "JUBILEE KNITWEAR INDUSTRIES",
        "person1": "Zia ul Haq",
        "zip": "",
        "telephone1": "+92 334 3488520",
        "telephone2": "",
        "mobile1": "+92 312 0270130",
        "mobile2": "",
        "infoMail": "",
        "website": "5333",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "82",
        "name": "KARSAZ TEXTILE INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5334",
        "operations": "Sea Export, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "83",
        "name": "KHADIJA INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5335",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "84",
        "name": "KOHINOOR MILLS LIMITED (DYING DIV)",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5336",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "85",
        "name": "KZ HOSIERY",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5337",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "87",
        "name": "LEATHER FIELD (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5338",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "88",
        "name": "LIBERMANN INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5339",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "89",
        "name": "LONGVIEW (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5340",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "90",
        "name": "LOTTE KOLSON (PVT.) LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "92 21 111-577-577",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "92 21 36374811",
        "infoMail": "",
        "website": "5341",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "91",
        "name": "LUCKY TEXTILE MILLS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5342",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "92",
        "name": "M. MAQSOOD CORPORATION",
        "person1": "Ahmed Hamid",
        "zip": "",
        "telephone1": "0092 3456830490",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5343",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "93",
        "name": "M.K KNITS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "tanveer@mkknits.com",
        "website": "5344",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "94",
        "name": "MAGNACRETE PVT LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5345",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "96",
        "name": "MARVA EXPORTS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5346",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "97",
        "name": "MASOOD TEXTILE MILLS LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5347",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "98",
        "name": "MASS APPARELS & FABRICS (PVT) LIMITED",
        "person1": "Shoaib Masood",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "3003654676",
        "mobile2": "",
        "infoMail": "",
        "website": "5348",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "99",
        "name": "MASTER MOTORS CORP (PVT) LTD.",
        "person1": "NOMAN QURESHI",
        "zip": "",
        "telephone1": "0092-3002282632",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "Noman.qureshi@mmcl.com.pk",
        "website": "5349",
        "operations": "Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "100",
        "name": "MEHRAN MARBLE INDUSTRIES.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5350",
        "operations": "",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "101",
        "name": "MEHRAN MARMI INDUSTRIES PVT.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5351",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "102",
        "name": "MEHRAN SPICE & INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5352",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "103",
        "name": "METALLOGEN (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5353",
        "operations": "Sea Import, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "104",
        "name": "METROTEX INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5354",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "105",
        "name": "MILESTONE TEXTILES.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5355",
        "operations": "Sea Import, Sea Export, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "106",
        "name": "MN TEXTILES (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5356",
        "operations": "Sea Import, Sea Export, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "107",
        "name": "MUSTAQIM DYEING",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5357",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "109",
        "name": "NATIONAL REFINERY LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5358",
        "operations": "Sea Import, Sea Export, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "110",
        "name": "NAVEENA INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5359",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "111",
        "name": "NAZEER APPARELS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5360",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "112",
        "name": "NETWORK ASIA LOGISTICS",
        "person1": "SYRUS PATEL",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "0314-2001955",
        "mobile2": "",
        "infoMail": "",
        "website": "5361",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "113",
        "name": "NEW MALIK & ASSOCIATES",
        "person1": "",
        "zip": "",
        "telephone1": "+9221 2563170",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5362",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "115",
        "name": "NISHAT MILLS LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5363",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "116",
        "name": "NIZAMIA APPAREL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5364",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "117",
        "name": "NUTRALFA AGRICOLE",
        "person1": "",
        "zip": "",
        "telephone1": "+92213 5888988/+92213 35888989",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5365",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "118",
        "name": "NUTRALFA PRIVATE LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7157",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "120",
        "name": "OOCL LOGISTICS PAKISTAN (PRIVATE) LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "0321-2199905",
        "mobile2": "",
        "infoMail": "",
        "website": "5366",
        "operations": "Sea Import, Sea Export, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "121",
        "name": "PAK ARAB PIPELINE COMPANY LTD.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5367",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "122",
        "name": "PAK SUZUKI MOTOR CO LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5368",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "123",
        "name": "PAKISTAN ONYX MARBLE",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5369",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "124",
        "name": "PAXAR PAKISTAN (PVT) LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5370",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "125",
        "name": "PELIKAN KNITWEAR",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5371",
        "operations": "Sea Import, Sea Export, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "127",
        "name": "PROCESS INDUSTRY PROCUREMENT CONSULTANTS PVT LTD",
        "person1": "M.JAVED AWAN",
        "zip": "",
        "telephone1": "+92 51 8772 844",
        "telephone2": "",
        "mobile1": "+92 300 8550864",
        "mobile2": "",
        "infoMail": "javed@pipcpl.com",
        "website": "5372",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "128",
        "name": "RAUF UNIVERSAL SHIPPING",
        "person1": "Kanwal-Operation Manager",
        "zip": "",
        "telephone1": "0092-21-34305556-7",
        "telephone2": "",
        "mobile1": "0092-3456178880",
        "mobile2": "",
        "infoMail": "",
        "website": "5373",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "129",
        "name": "REEMAXE GROUP OF INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5374",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "130",
        "name": "REVEL INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5375",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "132",
        "name": "ROYAL TREND",
        "person1": "DANIYAL TARIQ",
        "zip": "",
        "telephone1": "021 4547575",
        "telephone2": "",
        "mobile1": "0092-333-3367632",
        "mobile2": "",
        "infoMail": "",
        "website": "5376",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "134",
        "name": "S.AHMED GARMENTS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5377",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "135",
        "name": "S.M. TRADERS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5378",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "136",
        "name": "SAMI RAGS ENTERPRISES 74",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5379",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "137",
        "name": "SANALI SPORTS",
        "person1": "Mr. Niamet,",
        "zip": "",
        "telephone1": "+92 300 0950850",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "michael@thecampspot.com",
        "website": "5380",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "138",
        "name": "SAPPHIRE FIBRES LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5381",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "139",
        "name": "SAPPHIRE FINISHING MILLS LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5382",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "140",
        "name": "SARENA INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5383",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "141",
        "name": "SCANZA ENTERPRISES",
        "person1": "NOUMAN ANWAR",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "info@mufreight.com",
        "website": "5384",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "142",
        "name": "SCS EXPRESS PVT LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5385",
        "operations": "Sea Import, Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "143",
        "name": "SEA BLUE LOGISTICS",
        "person1": "RASHID BAIG",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5386",
        "operations": "Sea Import, Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "144",
        "name": "SESIL PVT LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5387",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "145",
        "name": "SHADDAN ENTERPRISES",
        "person1": "WAQAR",
        "zip": "",
        "telephone1": "92-321-8228707",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "Waqar <waqar@shaddanent.com>",
        "website": "5388",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "146",
        "name": "SHAFI GLUCOCHEM (PVT) LTD.",
        "person1": "Rizwan Rasheed Jakhrani",
        "zip": "",
        "telephone1": "92333-1367707",
        "telephone2": "",
        "mobile1": "0323-2656923",
        "mobile2": "",
        "infoMail": "",
        "website": "5389",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "147",
        "name": "SHAFI TEXCEL LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5390",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "148",
        "name": "SHIP THROUGH LOGISTICS",
        "person1": "SHEIKH ADEEL AHMED",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "0322-2371467",
        "mobile2": "",
        "infoMail": "",
        "website": "5391",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "149",
        "name": "SK STONES (PVT) LIMITED",
        "person1": "ISMAIL",
        "zip": "",
        "telephone1": "+92 111-STONES (786-637)",
        "telephone2": "",
        "mobile1": "+92 51 485 9036-37",
        "mobile2": "+92 51 4441174",
        "infoMail": "Amir Malik <malik@skstones.com>",
        "website": "5392",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "150",
        "name": "SOLEHRE BROTHERS INDUSTRIES",
        "person1": "MANI",
        "zip": "",
        "telephone1": "0092-52-3561506",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5393",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "151",
        "name": "SONIC TEXTILE INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5394",
        "operations": "Sea Import, Sea Export, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "153",
        "name": "STELLA SPORTS,",
        "person1": "",
        "zip": "",
        "telephone1": "+92 52 3307235",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "Javed  marketing@stellasports.com.pk",
        "website": "5395",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "154",
        "name": "STUDIO MARK",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5396",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "155",
        "name": "SULTAN C/O MR. FAISAL",
        "person1": "FAISAL BHAI",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5397",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "156",
        "name": "SULTEX INDUSTRIES.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5398",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "157",
        "name": "SUNTEX APPAREL INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5399",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "158",
        "name": "SUPREME RICE MILLS",
        "person1": "Safian Riasat Export Manager",
        "zip": "",
        "telephone1": "+92 301 7062067",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "safian@supremerice.com.pk",
        "website": "5400",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "159",
        "name": "SURGICON LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5401",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "160",
        "name": "SYNERGY LOGISTICS PAKISTAN",
        "person1": "Hussain Mansoor",
        "zip": "",
        "telephone1": "92-21-32410654",
        "telephone2": "",
        "mobile1": "-6265473",
        "mobile2": "",
        "infoMail": "sales@synergypakistan.com",
        "website": "5402",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "161",
        "name": "TAJ INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5403",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "162",
        "name": "TALON SPORTS (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5404",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "163",
        "name": "TRANDS APPAREL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5405",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "164",
        "name": "Thread Experts",
        "person1": "3008668851",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "ahmadriaz76@gmail.com",
        "website": "5406",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "165",
        "name": "UNITED TOWEL EXPORTERS(PVT) LTD.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5407",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "166",
        "name": "URWA INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "052-4582370",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "sales@urwaind.com",
        "website": "5408",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "167",
        "name": "USMAN & SONS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5409",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "168",
        "name": "USSK TEX",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5410",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "169",
        "name": "UTOPIA INDUSTRIES PVT LTD",
        "person1": "M. SAJID",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "muhammad.sajid@utopia.pk",
        "website": "5411",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "170",
        "name": "UZAIR INTERNAITONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "32059362",
        "mobile2": "",
        "infoMail": "",
        "website": "5412",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "171",
        "name": "Universal Logistics Services (Pvt.) Ltd.",
        "person1": "MR.FAWAD",
        "zip": "",
        "telephone1": "PHONE: 92-21-35671546,",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "Fax: 92-21-35687664",
        "infoMail": "",
        "website": "5413",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "172",
        "name": "VISION TECHNOLOGIES CORPORATION PVT LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5414",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "173",
        "name": "YASHA TRADERS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5415",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "174",
        "name": "Z.R SPORTS COMPANY",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5416",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "176",
        "name": "ZAHABIYA CHEMICAL INDUSTRIES.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5417",
        "operations": "Sea Import, Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "178",
        "name": "ZENITH TEXTILE",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5418",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "179",
        "name": "ZEPHYRS TEXTILE",
        "person1": "Muhammad Tanveer Iqbal",
        "zip": "",
        "telephone1": "92-61-6774777",
        "telephone2": "",
        "mobile1": "3012994176",
        "mobile2": "",
        "infoMail": "",
        "website": "5419",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "180",
        "name": "ZUBISMA APPARLE",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5420",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "214",
        "name": "NEWS LOGISTICS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5454",
        "operations": "Sea Import, Sea Export",
        "types": "Consignee"
    },
    {
        "PartyTypeId": "3",
        "code": "233",
        "name": "UNIVERSAL SHIPPING (PVT.) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "shiraz@usl.com.pk",
        "website": "5473",
        "operations": "Sea Import, Sea Export, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "3",
        "code": "571",
        "name": "SERVOTECH SHIPPING (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "21-2428791",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "21-2428794",
        "infoMail": "",
        "website": "6109",
        "operations": "Sea Import, Sea Export",
        "types": "Consignee"
    },
    {
        "PartyTypeId": "3",
        "code": "623",
        "name": "XPRESS AVIATION",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5925",
        "operations": "Sea Import, Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "691",
        "name": "A.K ENTERPRISES",
        "person1": "HAMID KHAN",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5558",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "692",
        "name": "A.Y LEATHER",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5559",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "694",
        "name": "AAS MOVING",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5560",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "695",
        "name": "ABDUR RAHMAN CORPORATION (PVT) LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "041 8787761-62",
        "telephone2": "",
        "mobile1": "0300 8658108",
        "mobile2": "",
        "infoMail": "",
        "website": "5561",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "696",
        "name": "ABID TEXTILE",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5562",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "698",
        "name": "ADNAN APPAREL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5563",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "699",
        "name": "AERO EXPRESS INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5564",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "700",
        "name": "AERTEX ENTERPRISES.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5565",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "701",
        "name": "AFINO TEXTILE MILLS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5566",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "703",
        "name": "AFROZE TEXTILE IND (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5567",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "704",
        "name": "AIR BLUE LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5568",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "706",
        "name": "AIRSIAL ENGINEERING & MAINTENANCE",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5569",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "712",
        "name": "AL HUSNAIN ENTERPRISES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5570",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "714",
        "name": "AL HUSSAIN TRADRES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5571",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "715",
        "name": "AL MASAOOD OIL INDUSTRY SUPPLIES & SERVICES CO",
        "person1": "www.almasaoodoilgas.com",
        "zip": "",
        "telephone1": "+92 51 8748466",
        "telephone2": "",
        "mobile1": "+92 302 8297759",
        "mobile2": "",
        "infoMail": "waqas@amoilgas.com",
        "website": "5572",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "717",
        "name": "AL REHMAN GLOBAL TEX (PVT) LIMITED,",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5573",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "718",
        "name": "AL SUBUK ENGINEERING ENTERPRISES",
        "person1": "HAFIZ SAEED UR REHMAN",
        "zip": "",
        "telephone1": "-34311129",
        "telephone2": "",
        "mobile1": "-34311117",
        "mobile2": "",
        "infoMail": "info@alsubuk.com",
        "website": "5574",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "721",
        "name": "AL-AZEEM ENTERPRISES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5575",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "722",
        "name": "AL-FALAH IMPEX",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5576",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "723",
        "name": "AL-MEENA MARINE ENGINEERS",
        "person1": "",
        "zip": "",
        "telephone1": "+92 21 32851421",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "+92 21 32857358",
        "infoMail": "",
        "website": "5577",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "724",
        "name": "AL-SIDDIQ CONSOLIDATOR (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5578",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "725",
        "name": "AL-TAYYIBA APPAREL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5579",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "726",
        "name": "ALAM INTERNATIONAL TRADERS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5580",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "727",
        "name": "ALI TRADING Co (Pvt) Ltd.",
        "person1": "Muhammad Yasir Hussain",
        "zip": "",
        "telephone1": "+92 52 3251101-3",
        "telephone2": "",
        "mobile1": "+92 315 6181824",
        "mobile2": "0092 52 3 25 1101,",
        "infoMail": "Muhammad Yasir <yasir@alitradingco.com>",
        "website": "5581",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "728",
        "name": "AM LOGISTIC",
        "person1": "ZEESHAN.TABANI",
        "zip": "",
        "telephone1": "0213-2377222",
        "telephone2": "",
        "mobile1": "3228292225",
        "mobile2": "",
        "infoMail": "",
        "website": "5582",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "729",
        "name": "AM TECHNOLOGIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5583",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "730",
        "name": "AMANULLAH ENTERPRISES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5584",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "731",
        "name": "AMBALA EXPORT TRADING CO",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5585",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "733",
        "name": "ANAS TROPICAL PRU & VEG EXPORT",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5586",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "734",
        "name": "ANDREW PAINTS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5587",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "736",
        "name": "AQSA INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "suqaf@hotmail.com",
        "website": "5588",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "737",
        "name": "ARABIAN ENTERPRISES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5589",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "738",
        "name": "ARIES LOGISTICS (PVT) LIMITED",
        "person1": "SIRAJ UL ISLAM",
        "zip": "",
        "telephone1": "0423588 9791",
        "telephone2": "",
        "mobile1": "3214339418",
        "mobile2": "",
        "infoMail": "",
        "website": "5590",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "739",
        "name": "ARSAM SPORTS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5591",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "740",
        "name": "ART LOGISTICS",
        "person1": "REHAN / IRFAN",
        "zip": "",
        "telephone1": "34321721-2",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5592",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "741",
        "name": "ARTISAN TEXTILE",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5593",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "742",
        "name": "ARZOO TEXTILES MILLS LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5594",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "743",
        "name": "ASIA POULTRY FEEDS PVT LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5595",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "744",
        "name": "ASSAC CARPETS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5596",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "745",
        "name": "ASTUTE SPORTS",
        "person1": "",
        "zip": "",
        "telephone1": "0092-52 3552201",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5597",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "746",
        "name": "ATROX INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5598",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "747",
        "name": "ATTOCK REFINERY LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5599",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "749",
        "name": "AWAN SPORTS INDUSTRIES PVT LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5600",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "750",
        "name": "BACO INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5601",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "751",
        "name": "BALMEERA INTERTRADE",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5602",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "752",
        "name": "BARKET FIRTILIZERS (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5603",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "754",
        "name": "BILAL & COMPANY",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5604",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "755",
        "name": "BOLA GEMA- PAKISTAN",
        "person1": "AFTAB AHMED",
        "zip": "",
        "telephone1": ":+92 304-2152488",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "exports@bolagema.com Exports@bolagema.com",
        "website": "5605",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "756",
        "name": "BOX RING",
        "person1": "",
        "zip": "",
        "telephone1": "+92 52 3574210",
        "telephone2": "",
        "mobile1": "+92 312 789 1765",
        "mobile2": "",
        "infoMail": "export@boxring.pk",
        "website": "5606",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "757",
        "name": "BRIGHT SAIL PAKISTAN",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5607",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "758",
        "name": "BROTHERS PRODUCTION PVT LTD.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5608",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "759",
        "name": "BUKSH CARPET",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5609",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "760",
        "name": "BUREAU VERITAS PAKISTAN PVT LTD",
        "person1": "MR.NUDRAT AMIN",
        "zip": "",
        "telephone1": "-33262034",
        "telephone2": "",
        "mobile1": "-2329391",
        "mobile2": "+92 21- 3563230",
        "infoMail": "NUDRAT.AMIR@BUREAUVERITAS.COM",
        "website": "5610",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "761",
        "name": "CAPITAL SPORTS CORPORATION (PVT)",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5611",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "762",
        "name": "CARGO AND COMMODITIES PVT LTD",
        "person1": "",
        "zip": "",
        "telephone1": "0092 333 2589093",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "info@carcom.net.pk",
        "website": "5612",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "763",
        "name": "CARGO CRYSTAL (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5613",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "764",
        "name": "CARGO SOLUTION SERVICES",
        "person1": "",
        "zip": "",
        "telephone1": "92 21 34549441",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7109",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "765",
        "name": "CARGO TRACK",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5614",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "767",
        "name": "CASUAL CLOTHING CO",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5615",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "768",
        "name": "CELERITY SUPPLY CHAIN (PVT) LTD.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5616",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "769",
        "name": "CENTRAL ORDINANCE AVIATION DEPOT",
        "person1": "MAQSOOD Hussain",
        "zip": "",
        "telephone1": "9.23E+11",
        "telephone2": "",
        "mobile1": "-4052643",
        "mobile2": "",
        "infoMail": "",
        "website": "5617",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "770",
        "name": "CHADHARY IJAZ AHMAD & SONS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5618",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "771",
        "name": "CHEEMA BROTHERS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5619",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "772",
        "name": "CHENAB APPAREL (PVT) LTD",
        "person1": "MIRZA NASIR MAHMOOD",
        "zip": "",
        "telephone1": "041-8754472",
        "telephone2": "",
        "mobile1": "3028655995",
        "mobile2": "",
        "infoMail": "",
        "website": "5620",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "773",
        "name": "CHT PAKISTAN (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5621",
        "operations": "Sea Import, Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "774",
        "name": "CIVIL AVIATION AUTHORITY",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5622",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "775",
        "name": "COMBINED LOGISTICS INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5623",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "776",
        "name": "COMET SPORTS (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5624",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "777",
        "name": "COMMANDING OFFICER",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5625",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "778",
        "name": "COMPANION SERVICES",
        "person1": "NADEEM",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "3002177526",
        "mobile2": "",
        "infoMail": "",
        "website": "5626",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "779",
        "name": "CONSOLIDATION SHIPPING &",
        "person1": "",
        "zip": "",
        "telephone1": "(92-21) 2426287-8",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "(92-21) 2426639",
        "infoMail": "",
        "website": "5627",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "780",
        "name": "CONTINENTAL TEXTILES (PVT) LTD",
        "person1": "MR. FARHAN",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5628",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "781",
        "name": "CORAL ENTERPRISES (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5629",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "782",
        "name": "COTTON CLUB",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5630",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "783",
        "name": "CROSS WEAR",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5631",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "784",
        "name": "D.G. Khan Cement Co. Ltd",
        "person1": "",
        "zip": "",
        "telephone1": "+92 42 111 11 33 33 Ext. 4327",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "NTN # 1213275-6",
        "infoMail": "",
        "website": "5632",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "785",
        "name": "DANISH TRADERS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5633",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "786",
        "name": "DAWOOD MEAT COMPANY (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5634",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "787",
        "name": "DEEPSEA",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5635",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "788",
        "name": "DELTEX",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5636",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "789",
        "name": "DENIM CRAFTS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6038",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "791",
        "name": "DIGITAL APPAREL (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5637",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "792",
        "name": "DIGRACIA KNITS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5638",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "793",
        "name": "DISTRICT CONTROLLER OF STORES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5639",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "794",
        "name": "DIVINE LOGISTICS INTERNATIONAL",
        "person1": "Skype:rizwanmasood307",
        "zip": "",
        "telephone1": "0092-021-34604447",
        "telephone2": "",
        "mobile1": "0092-307-2933892",
        "mobile2": "divinelogisticsint@gmail.com",
        "infoMail": "sales@divinelogisticsint.com",
        "website": "5640",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "796",
        "name": "DYNAMIC TOOLING SERVICES",
        "person1": "",
        "zip": "",
        "telephone1": "+92 21 34331008",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "info@dts.com.pk",
        "website": "5641",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "797",
        "name": "E2E SUPPLY CHAIN MANAGMENT (PVT) LT",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5642",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "798",
        "name": "EASTWAY GLOBAL FORWARDING LTD",
        "person1": "Frank McNamara",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "+353 61 500700",
        "mobile2": "",
        "infoMail": "frank@eastway.ie",
        "website": "5643",
        "operations": "Sea Export, Air Import",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "799",
        "name": "ECU LINE PAKISTAN (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5644",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "801",
        "name": "EESHOO TOYS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5645",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "802",
        "name": "ELEGANT Co",
        "person1": "ALI ASIF",
        "zip": "",
        "telephone1": "3006120637",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5646",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "803",
        "name": "ENGINEERING SOLUTIONS (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5647",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "804",
        "name": "ENGRO POWERGEN QADIRPUR LIMITED",
        "person1": "MR SHABANA SHAIKH",
        "zip": "",
        "telephone1": "-35297888",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5648",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "805",
        "name": "EURO SUPPLY CHAIN & LOGISTICS SERVICES",
        "person1": "Mohammed Zaki",
        "zip": "",
        "telephone1": "+971 50 2472559",
        "telephone2": "",
        "mobile1": "+92 301 2191500",
        "mobile2": "",
        "infoMail": "",
        "website": "5649",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "806",
        "name": "EUROTEX",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5650",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "808",
        "name": "F.E.B INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5651",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "809",
        "name": "FAHAD INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5652",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "810",
        "name": "FAIRDEAL MILLS (PVT) LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5653",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "811",
        "name": "FAISAL FABRICS LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5654",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "812",
        "name": "FAISAL SPINNING MILLS LTD FINISHING UNIT",
        "person1": "",
        "zip": "",
        "telephone1": "+92 42 111-130-130",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5655",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "814",
        "name": "FAST & FINE CARGO SERVICES",
        "person1": "",
        "zip": "75080",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5656",
        "operations": "Sea Import, Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "815",
        "name": "FAST FLY IMPEX",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5657",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "816",
        "name": "FATIMA WEAVING MILLS (PVT)LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5658",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "817",
        "name": "FAUJI FRESH N FREEZE LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5659",
        "operations": "",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "818",
        "name": "FAZAL CLOTH MILLS LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5660",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "819",
        "name": "FAZAL REHMAN FABRICS LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5661",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "821",
        "name": "FILTRADER PVT LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5662",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "822",
        "name": "FINE COTTON TEXTILES.,",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5663",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "823",
        "name": "FOODEX",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5664",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "824",
        "name": "FORCE FIVE PVT LTD.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5665",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "825",
        "name": "FORTE LOGISTICS SOLUTIONS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "3238224828",
        "mobile2": "",
        "infoMail": "",
        "website": "5666",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "826",
        "name": "G.M FASHION",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5667",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "827",
        "name": "GARATEX",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5668",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "831",
        "name": "GETZ PHARMA (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5669",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "832",
        "name": "GLOBAL CORPORATION",
        "person1": "",
        "zip": "",
        "telephone1": "-34311046",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5670",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "833",
        "name": "GLOBAL LOGISTICS INTERNATIONAL",
        "person1": "FARHAN HAIDER",
        "zip": "",
        "telephone1": "+92 213 4167700-01",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5671",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "834",
        "name": "GLOBE X LOGISTICS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5672",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "835",
        "name": "GLOBELINK PAKISTAN (PVT) LTD",
        "person1": "IRSHAD",
        "zip": "",
        "telephone1": "111298298",
        "telephone2": "",
        "mobile1": "3222836583",
        "mobile2": "32851678",
        "infoMail": "sales2@globelinkpk.com",
        "website": "5673",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "836",
        "name": "GLOW PAK INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "0092-42-35213701",
        "mobile2": "",
        "infoMail": "",
        "website": "5674",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "837",
        "name": "GOLD & SILVER TITANIUM IND",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5675",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "838",
        "name": "GREEN BRIDGE ENTERPRISE",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5676",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "840",
        "name": "GUL AHMED TEXTILE MILLS LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5677",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "841",
        "name": "GULF CHEMICALS (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5678",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "843",
        "name": "HADI RASHEED SAIYID",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5679",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "844",
        "name": "HAFIZ TANNERY",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5680",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "845",
        "name": "HAFIZ TANNERY (IMPORT)",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5681",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "847",
        "name": "HAMZA ENTERPRISES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5682",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "848",
        "name": "HANA CARPETS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5683",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "849",
        "name": "HANZ TILES & CERAMICS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5684",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "850",
        "name": "HASHI CORPORATION",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5685",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "851",
        "name": "HASNAIN CARGO SERVICES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5686",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "852",
        "name": "HASSAN INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5687",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "855",
        "name": "HI JEANS",
        "person1": "NAZIA",
        "zip": "",
        "telephone1": "3442881688",
        "telephone2": "",
        "mobile1": "3335253126",
        "mobile2": "",
        "infoMail": "Nazia Plus Time <naziaplustime@gmail.com>",
        "website": "5688",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "856",
        "name": "HIGHWAY LOGISTICS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5689",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "858",
        "name": "HONEST FOOD PRODUCTS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5690",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "860",
        "name": "HORIZAN MFG CO",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5691",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "861",
        "name": "IBRAHIM ASSOCIATES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5692",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "862",
        "name": "IDREES (CARGO LINKERS)",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5693",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "863",
        "name": "IEDGE",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5694",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "864",
        "name": "IMRAN BROTHERS.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5695",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "865",
        "name": "IMTCO PAKISTAN",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5696",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "866",
        "name": "INDEPENDENT OIL TOOLS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5697",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "868",
        "name": "INT'L AIR & SEA CARGO SERVICES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5698",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "869",
        "name": "INT'L TEXTILE DISTRIBUTORS INC",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5699",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "870",
        "name": "INTER FREIGHT",
        "person1": "ARSHAD BHAI",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5700",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "871",
        "name": "INTER FREIGHT - SAJID",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5701",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "872",
        "name": "INTERNATIONAL BUSINESS CENTRE",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5702",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "873",
        "name": "INTERNATIONAL BUSINESS CENTRE.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5703",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "874",
        "name": "INTERNATIONAL CARGO MANAGEMENT (ICM)",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5704",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "876",
        "name": "IRAN & BUKHARA PALACE",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5705",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "877",
        "name": "IRON FIST IMPEX (PRIVATE) LIMITED",
        "person1": "ZAKAULLAH KHAN",
        "zip": "",
        "telephone1": "-1265",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "IRON FIST <info@himalayanzsalt.com>",
        "website": "5706",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "879",
        "name": "ISMAIL SPORTS GARMENTS IND",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5707",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "880",
        "name": "ITD TEXTILES (PVT.) LIMITED.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5708",
        "operations": "Sea Import, Sea Export, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "881",
        "name": "JAFFER AGRO SERVICES (PVT) LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5709",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "882",
        "name": "JAGTEX (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "0092-41-8766612-15",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5710",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "883",
        "name": "JAGUAR (PVT) LTD",
        "person1": "MR. JAMAT ALI",
        "zip": "",
        "telephone1": "041-766712/15",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5711",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "884",
        "name": "JAHANZAIB MISBAH",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5712",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "885",
        "name": "JAMAL DIN LEATHER IMPEX",
        "person1": "",
        "zip": "",
        "telephone1": "-4271287",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "-3517962",
        "infoMail": "naveed@jdleather.com",
        "website": "5713",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "887",
        "name": "JAUN ENTERPRISES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5714",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "888",
        "name": "JEHANGIR KHAN INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5715",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "889",
        "name": "JEHANZEB MUHMAND & CO",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5716",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "890",
        "name": "JOONAID CO.",
        "person1": "",
        "zip": "",
        "telephone1": "2727092.2767177.2770611",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "(92-21) 272676",
        "infoMail": "bawanies@yahoo.com",
        "website": "5717",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "891",
        "name": "K-ELECTRIC LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5718",
        "operations": "Sea Export, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "892",
        "name": "K.A. ENTERPRISES PRIVATE LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5719",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "893",
        "name": "K.B. ENTERPRISES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5720",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "894",
        "name": "K.P INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5721",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "895",
        "name": "KAMAL TEXTILE MILLS (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5722",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "896",
        "name": "KAMRAN C/O GERRY'S",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5723",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "899",
        "name": "KARACHI CARGO SERVICES PVT LTD",
        "person1": "NAVEED ASHRAF VARDIA",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "0092-321-2685600",
        "mobile2": "",
        "infoMail": "",
        "website": "5724",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "900",
        "name": "KAYSONS INTERNATIONAL (PVT.) L",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5725",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "901",
        "name": "KHATTAK TRADERS",
        "person1": "GULZAR",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5726",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "902",
        "name": "KIMPEX SPORTS INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5727",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "903",
        "name": "KOHAT CEMENT COMPANY LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5728",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "904",
        "name": "KOHINOOR TEXTILES MILLS LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5729",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "905",
        "name": "KRISHNA SPORTS CORPORATION",
        "person1": "",
        "zip": "",
        "telephone1": "523561797",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5730",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "906",
        "name": "LAKHANAY SILK MILLS (PVT) LTD.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "3232039718",
        "mobile2": "",
        "infoMail": "",
        "website": "5731",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "907",
        "name": "LASER SPORTS (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5732",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "908",
        "name": "LIBERTY MILLS LIMITED",
        "person1": "RAZZAQ BHAI",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5733",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "909",
        "name": "LOGWAYS INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5734",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "910",
        "name": "LOJISTICA",
        "person1": "",
        "zip": "",
        "telephone1": "3458778222",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5735",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "911",
        "name": "M. A. ARAIN & BROTHERS (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5736",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "912",
        "name": "M.R. INDUSTRIES.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5737",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "913",
        "name": "M.T TECHNIQUES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5738",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "914",
        "name": "M.TAYYAB M.SHOAIB TRADING CORP.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5739",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "915",
        "name": "M/S BOX RING",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5740",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "916",
        "name": "MACHTRADE CORPORATION",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5741",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "917",
        "name": "MACRO EXPORTS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5742",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "918",
        "name": "MAHAD SPORTS WEAR",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5743",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "919",
        "name": "MAHMOOD BROTHERS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5744",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "920",
        "name": "MALIK SPORTS",
        "person1": "",
        "zip": "",
        "telephone1": "0092 52 3525 550",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5745",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "921",
        "name": "MAMA",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5746",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "922",
        "name": "MAP ENTERPRISES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5747",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "924",
        "name": "MAQSOOD TRADERS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5748",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "925",
        "name": "MAROOF INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5749",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "926",
        "name": "MASHRIQ GEMS.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5750",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "927",
        "name": "MASTER TEXTILE MILLS LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5751",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "929",
        "name": "MAVRK JEANS INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5752",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "930",
        "name": "MAXPEED SHIPPING & LOGISTICS",
        "person1": "NOSHAN",
        "zip": "",
        "telephone1": "+92-213- 242 1426 - 27 (02 Lin",
        "telephone2": "",
        "mobile1": "+92-345- 220 6966",
        "mobile2": "+92-213- 242 1428",
        "infoMail": "noshan@maxpeedshipping.com",
        "website": "5753",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "932",
        "name": "MEDISPOREX (PRIVATE) LIMITED",
        "person1": "Mr. Waqas",
        "zip": "",
        "telephone1": "-8711608",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5754",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "933",
        "name": "MEHAR CARGO (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5755",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "934",
        "name": "MEHER AND CO",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5756",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "936",
        "name": "METAL MASTERS",
        "person1": "",
        "zip": "",
        "telephone1": "923251548",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5757",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "937",
        "name": "MINZI INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5758",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "938",
        "name": "MISC. (PERSONAL BAGG/EFECT)",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5759",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "939",
        "name": "MISL",
        "person1": "Muhammad Humais Bhurgri",
        "zip": "",
        "telephone1": "+92 21 32360101-3",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5760",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "941",
        "name": "MISTIQUBE",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "92514578230",
        "mobile2": "",
        "infoMail": "INFO@MISTIQUBE.COM",
        "website": "5761",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "942",
        "name": "MOHSIN TEXTILE",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5762",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "944",
        "name": "MRS RAFIKA ABDUL KHALIQ",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5763",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "945",
        "name": "MRS. AZRA ASIF SATTAR",
        "person1": "MR AAMIR / CARGO LINKER",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5764",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "946",
        "name": "MS HINA SHARIQ / C/O SHAHID SAHAB",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5765",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "947",
        "name": "MUEED ESTABLISHMENT",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5766",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "948",
        "name": "MUHAMMAD NAWAZ",
        "person1": "MIRZA FAROOQ",
        "zip": "",
        "telephone1": "201-681-9957",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5767",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "950",
        "name": "MUSHKO PRINTING SOLUTIONS (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5768",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "951",
        "name": "MUSHTAQ INTERNATIONAL TRADERS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5769",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "952",
        "name": "MUSTAFA & COMPANY (PVT.) LTD.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5770",
        "operations": "Sea Import, Sea Export, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "953",
        "name": "MUSTAQIM DYING & PRINTING INDUSTRIES PVT LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5771",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "954",
        "name": "MUTABAL FOOD LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5772",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "955",
        "name": "MY CARGO",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5773",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "956",
        "name": "MY LOGISTICS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5774",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "958",
        "name": "Muhammad Jahangir Enterprises",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7213",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "959",
        "name": "NABIQASIM INDUSTRIES PVT LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5775",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "960",
        "name": "NAIZMH ENTERPRISES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5776",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "961",
        "name": "NASARUN EXPORTS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5777",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "962",
        "name": "NAUTILUS GLOBAL MARINE SERVICES",
        "person1": "Omer Ovais Akram, -CEO",
        "zip": "",
        "telephone1": "+92 21 35822550",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "+92 21 35822550",
        "infoMail": "omer@nautilus-glo.com",
        "website": "5778",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "963",
        "name": "NAVEENA EXPORTS LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5779",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "964",
        "name": "NAWAZ FABRICS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6209",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "966",
        "name": "NFK EXPORTS ( PVT ) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5780",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "967",
        "name": "NIAZ GARMENTS INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5781",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "969",
        "name": "NOOR SONS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5782",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "970",
        "name": "NOSH FOOD INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5783",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "971",
        "name": "NOVA INTERNATIONAL PVT LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5784",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "972",
        "name": "NOVA LEATHER",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5785",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "974",
        "name": "OHRENMANN CARPET PALACE.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5786",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "976",
        "name": "ORGANO BOTANICA",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5787",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "977",
        "name": "ORIENT CARGO SERVICES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5788",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "978",
        "name": "ORIENT TEXTILE MILLS LIMTED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5789",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "979",
        "name": "PACIFIC FREIGHT SYSTEM(PVT)LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5790",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "980",
        "name": "PAK APPARELS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5791",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "981",
        "name": "PAK AVIATION ENGINEERING SRVS (2)",
        "person1": "PAKISTAN",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5792",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "982",
        "name": "PAK HYDRAULIC & TRADING CO",
        "person1": "",
        "zip": "",
        "telephone1": "4236284170",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5793",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "983",
        "name": "PAK MINES INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5794",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "986",
        "name": "PAK VEGETABLES & FRUITS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5795",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "988",
        "name": "PAKISTAN AIR FORCE",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5796",
        "operations": "Sea Export, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "989",
        "name": "PAKISTAN INTERNATIONAL AIRLINE CORP",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5797",
        "operations": "Sea Export, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "990",
        "name": "PARAMOUNT TRADING CO",
        "person1": "MAHTAB",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5798",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "991",
        "name": "PCS LOGISTICS (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5799",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "992",
        "name": "PEARL SCAFFOLD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5800",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "993",
        "name": "PELLE CLASSICS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5801",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "994",
        "name": "PENNA OVERSEAS CORP",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5802",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "995",
        "name": "PERFECT ASSOCIATES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5803",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "997",
        "name": "PREMIER TRADERS",
        "person1": "",
        "zip": "",
        "telephone1": "021-32417740",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5804",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "999",
        "name": "PRIME COAT PVT LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5805",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1000",
        "name": "PROHAND INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5806",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "1001",
        "name": "PROLINE (PVT) LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5807",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1002",
        "name": "PUNJAB THERMAL POWER PVT LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5808",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1003",
        "name": "QUALITY DYEING & FINISHING",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5809",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1004",
        "name": "QUALITY EXPORT INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5810",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1005",
        "name": "QUICE FOOD INDUSTRIES LIMITED",
        "person1": "Sufiyan Shahid",
        "zip": "",
        "telephone1": "PH0213-4857177",
        "telephone2": "",
        "mobile1": "+92 302 8293365",
        "mobile2": "",
        "infoMail": "",
        "website": "5811",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1007",
        "name": "R.J INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5812",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1008",
        "name": "RABI ENTERPRISES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "0300-8266275",
        "mobile2": "",
        "infoMail": "",
        "website": "5813",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1009",
        "name": "RAJA BROTHERS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5814",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1010",
        "name": "RAJWANI APPAREL (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5815",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1011",
        "name": "RAJWANI DENIM MILLS (PVT) LTD.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5816",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1012",
        "name": "RANI & COMPANY",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5817",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1013",
        "name": "REAL STAR SURGICAL INSTRUMENTS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5818",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1014",
        "name": "REHMAT E SHEREEN",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5819",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1015",
        "name": "RELIANCE COTTON SPINNING MILLS LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5820",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1016",
        "name": "RIMMER INDUSTRIES (REGD)",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5821",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1017",
        "name": "RISHAD MATEEN & CO",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5822",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1018",
        "name": "RISING SPORTSWEAR",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "0300-9248816",
        "mobile2": "",
        "infoMail": "",
        "website": "5823",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1019",
        "name": "ROSHAN ENTERPRISES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5824",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1020",
        "name": "ROWER SPORTS",
        "person1": "",
        "zip": "",
        "telephone1": "0092 313 7951542",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5825",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1021",
        "name": "RUBY COLLECTION",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5826",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1022",
        "name": "S M DENIM MILLS",
        "person1": "",
        "zip": "",
        "telephone1": "2132562310",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5827",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1024",
        "name": "S.SAQLAINIA ENTERPRISE (PVT) LTD",
        "person1": "ZEESHAN",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5828",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1025",
        "name": "SAARUNG SHIPPING",
        "person1": "obaid ur rehmen",
        "zip": "",
        "telephone1": "+92 21 32603642-43",
        "telephone2": "",
        "mobile1": "+92 345 2913312",
        "mobile2": "",
        "infoMail": "info@saarunglogistics.com",
        "website": "5829",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1026",
        "name": "SACHIN SPORTS INDUSTRIES",
        "person1": "Sachin Kumar",
        "zip": "",
        "telephone1": "-3999806",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5830",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1028",
        "name": "SADAQAT LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5831",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1029",
        "name": "SAEED KHAN ENTERPRISES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5832",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1030",
        "name": "SAFAI INTERNATIONAL.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5833",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1031",
        "name": "SAFINA LOGISTICS (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "92 21 32468121-4",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "92 21 32468125",
        "infoMail": "",
        "website": "5834",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1032",
        "name": "SAIM MOBEEN FOOD INDUSTRIES LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5835",
        "operations": "Sea Export, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "1034",
        "name": "SAJJAN S/O IBRAHIM.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5836",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1035",
        "name": "SALIMUSA SPORTS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5837",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1036",
        "name": "SALMIS FURNISHERS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5838",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1039",
        "name": "SAPPHIRE FINISHING MILLS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "TEL:+92-042-5393492",
        "mobile2": "",
        "infoMail": "",
        "website": "5839",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1040",
        "name": "SARENA TEXTILE INDUSTRIES (PVT.) LTD.",
        "person1": "",
        "zip": "",
        "telephone1": "0092-42-111 222 500",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5840",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1041",
        "name": "SAUDI PAK LIVE STOCK (KHURSHEED)",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5841",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1042",
        "name": "SAUDI PAK LIVE STOCK (POTATO)",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5842",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1043",
        "name": "SAUDI PAK LIVE STOCK MEAT CO",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5843",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1044",
        "name": "SAVILLE WHITTLE INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5844",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1045",
        "name": "SAZ INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5845",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1046",
        "name": "SCHAZOO PHARMACEUTICAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5846",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1047",
        "name": "SEA GOLD (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5847",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1048",
        "name": "SEA WAY LOGISTICS",
        "person1": "Mohammad Shakeel",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "+92 318 596 9977",
        "mobile2": "",
        "infoMail": "shakeel@seaways-logistics.net",
        "website": "5848",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1049",
        "name": "SEAGULL SHIPPING & LOGISTICS  (PVT)",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5849",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "1050",
        "name": "SERENE AIR",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5850",
        "operations": "Sea Export, Air Import",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1051",
        "name": "SERVICE INDUSTRIES LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5851",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1052",
        "name": "SERVOPAK SHIPPING AGENCY",
        "person1": "SHARJEEL",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "92 345 278 4488",
        "mobile2": "",
        "infoMail": "",
        "website": "5852",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1053",
        "name": "SERVOTECH PVT LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5853",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1054",
        "name": "SEVEN STAR INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5854",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1055",
        "name": "SG MANUFACTURER",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5855",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1056",
        "name": "SHADAB CORP",
        "person1": "MR ADIL",
        "zip": "",
        "telephone1": "37010230-37010231",
        "telephone2": "",
        "mobile1": "3219295137",
        "mobile2": "",
        "infoMail": "",
        "website": "5856",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1058",
        "name": "SHAHAB GARMENTS",
        "person1": "WAHEED",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "0333-2180656",
        "mobile2": "",
        "infoMail": "",
        "website": "5857",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1059",
        "name": "SHAHEEN AIR INT'L LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5858",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1060",
        "name": "SHAHEEN AIR INTL LTD (2)",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5859",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1061",
        "name": "SHAHID & SONS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5860",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "1062",
        "name": "SHAHZAD APPARELS (PVT) LTD",
        "person1": "ZIA UL HAQ",
        "zip": "",
        "telephone1": "+92 334 3488520",
        "telephone2": "",
        "mobile1": "+92 312 0270130",
        "mobile2": "",
        "infoMail": "Zia ul Haq <ziaulhaq@faizanapparels.com>",
        "website": "5861",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1063",
        "name": "SHANCO SPORTS CORPORATION",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5862",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1064",
        "name": "SHANGRILA FOODS (PRIVATE) LIMITED.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5863",
        "operations": "",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1065",
        "name": "SHEKHANI INDUSTRIES",
        "person1": "HARIS",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5864",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1067",
        "name": "SINE INTERNATIONAL (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5865",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1068",
        "name": "SITARA CHEMICAL INDS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5866",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1069",
        "name": "SKY LINKERS INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5867",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1070",
        "name": "SMA ENTERPRISES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5868",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1071",
        "name": "SMS CHEMICAL INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5869",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1072",
        "name": "SNS IMPEX",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5870",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1074",
        "name": "SPORTS CHANNEL",
        "person1": "IMRAN",
        "zip": "",
        "telephone1": "4580261",
        "telephone2": "",
        "mobile1": "3012318018",
        "mobile2": "4600749",
        "infoMail": "SALES@SPORTSCHANNEL.PK",
        "website": "5871",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1075",
        "name": "SQ COMMODITIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5872",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1076",
        "name": "STAR SHIPPING (PVT)",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5873",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1077",
        "name": "STARPAK MARTIAL ARTS (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5874",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1078",
        "name": "STITCH LINE APPAREL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5875",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1079",
        "name": "STYLO SHOES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5876",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1081",
        "name": "SUN INDUSTRIAL EQUIPMENT PAKISTAN",
        "person1": "Kulsoom Nazir (Ms.)",
        "zip": "",
        "telephone1": ": +92-21-34376667",
        "telephone2": "",
        "mobile1": "-4376912",
        "mobile2": "-34366597",
        "infoMail": "kulsoom.suntech@gmail.com",
        "website": "5877",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1083",
        "name": "SUNNY ENTERPRISES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5878",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1085",
        "name": "SUNNY INT'L",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5879",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1086",
        "name": "SURYA SPORTS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5880",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1087",
        "name": "SWIFT SHIPPING (PVT) LTD",
        "person1": "M. Hameedullah Ahmed",
        "zip": "",
        "telephone1": "92-21 32200042",
        "telephone2": "",
        "mobile1": "3008217354",
        "mobile2": "",
        "infoMail": "hameed.ahmed@swiftshipping.net",
        "website": "5881",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1089",
        "name": "T S MARBLE INDUSTRY",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5882",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1090",
        "name": "TABO GUGOO INDUSTRIES (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "-540768",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5883",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1091",
        "name": "TAJ ENTERPRISES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5884",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1092",
        "name": "TEAM FREIGHT MANAGEMENT",
        "person1": "MR. AHMED",
        "zip": "",
        "telephone1": "+ 92.21.34326801-3",
        "telephone2": "",
        "mobile1": "3222277386",
        "mobile2": "34322249",
        "infoMail": "ahmed@team-freight.com",
        "website": "5885",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1093",
        "name": "TETRA PAK PAKISTAN LTD",
        "person1": "",
        "zip": "",
        "telephone1": "9.23E+11",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5886",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1094",
        "name": "TEX KNIT INT",
        "person1": "",
        "zip": "",
        "telephone1": "+92 331 3805031",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5887",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1095",
        "name": "TEX-KNIT INT",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5888",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1096",
        "name": "TEXTILE CHANNEL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5889",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1097",
        "name": "TEXTILE VISION",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5890",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1098",
        "name": "THE CRESCENT TEXTILE MILLS LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5891",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1099",
        "name": "THE INDUS HOSPITAL & HEALTH NETWORK",
        "person1": "Nazish Iqbal Assistant Manager",
        "zip": "",
        "telephone1": "+92 21 35112709",
        "telephone2": "",
        "mobile1": "-2874028",
        "mobile2": "",
        "infoMail": "nazish.iqbal@tih.org.pk",
        "website": "5892",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1100",
        "name": "THE LEATHER COMPANY",
        "person1": "MR SHAKIR",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "3008225898",
        "mobile2": "",
        "infoMail": "",
        "website": "5893",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1101",
        "name": "THE ORGANIC MEAT COMPANY (PVT.) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5894",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1102",
        "name": "THE SPORT STORE",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5895",
        "operations": "Sea Import, Sea Export, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "1103",
        "name": "THE TREASURER",
        "person1": "",
        "zip": "",
        "telephone1": "+92 33 34246309",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5896",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1104",
        "name": "TNG  LOGISTICS",
        "person1": "SYED FAISAL",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "3212213585",
        "mobile2": "",
        "infoMail": "faisal@tnglogistics.com",
        "website": "5897",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1106",
        "name": "TRADE INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5898",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "1107",
        "name": "U & I GARMENTS (PVT) LTD",
        "person1": "Liaquat",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "liaumair@gmail.com",
        "website": "5899",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1108",
        "name": "U.K MARTIAL ARTS INTERNATION",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5900",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1109",
        "name": "UNI CRAFT",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5901",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1110",
        "name": "UNIBIS LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5902",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "1111",
        "name": "UNIBRO INDUSTRIES LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5903",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1112",
        "name": "UNICORP INSTRUMENT",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5904",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1113",
        "name": "UNION CARGO (PRIVATE) LIMITED",
        "person1": "IMRAN JAFEER",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "+92 300 9236104",
        "mobile2": "",
        "infoMail": "imranhaffer@uclpakistan.com",
        "website": "5905",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1114",
        "name": "UNION FABRICS PRIVATE LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "-32567789",
        "mobile2": "",
        "infoMail": "",
        "website": "5906",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1115",
        "name": "UNIQUE ENTERPRISES (PVT.) LTD.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5907",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1116",
        "name": "UNIQUE MARITIME",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5908",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1117",
        "name": "UNISHIP GLOBAL LOGISTICS",
        "person1": "MR. ABID",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "0321-2444714",
        "mobile2": "",
        "infoMail": "abid@uniship.net",
        "website": "5909",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1118",
        "name": "UNISHIP GLOBAL SERVICES",
        "person1": "Mr.Abid Paracha",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "0092-321 2444714",
        "mobile2": "",
        "infoMail": "abid@uniship.net",
        "website": "5910",
        "operations": "Sea Export, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "3",
        "code": "1119",
        "name": "UNISHIP PAKISTAN",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5911",
        "operations": "Sea Import, Sea Export, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "1120",
        "name": "UNITED TOWEL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5912",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1121",
        "name": "UNIVERSAL FREIGHT SYSTEMS (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5913",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1122",
        "name": "UNIVERSAL SHIPPING",
        "person1": "",
        "zip": "",
        "telephone1": "KAMRAN BHOJA",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5914",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1123",
        "name": "VENUS GLOBAL LOGISTICS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5915",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1125",
        "name": "VISION AIR INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5916",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1127",
        "name": "VISION TECHNOLOGIES CORPORATION (PRIVATE) L",
        "person1": "Muhammad Irfan",
        "zip": "",
        "telephone1": "92 52 3549393",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "92 52 3549239",
        "infoMail": "Muhammad Irfan <irfan@vision.com.pk>",
        "website": "5917",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1130",
        "name": "WATER REGIME (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "-422956.8706",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "info@waterregime.com",
        "website": "5918",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1131",
        "name": "WELCOME SHIPPING AIDS PVT LTD",
        "person1": "mohammad Fawad",
        "zip": "",
        "telephone1": "-34577700",
        "telephone2": "",
        "mobile1": "0310-2784559",
        "mobile2": "",
        "infoMail": "mfawad@welcomeshipping.com",
        "website": "5919",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1132",
        "name": "WELDON INSTRUMENTS.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5920",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1133",
        "name": "WILD ORCHARD (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5921",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1134",
        "name": "WINGS EXPRESS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5922",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1135",
        "name": "WORLD LINK SHIPPING AGENCY",
        "person1": "MEHWISH",
        "zip": "",
        "telephone1": "34256987",
        "telephone2": "",
        "mobile1": "3018282771",
        "mobile2": "",
        "infoMail": "",
        "website": "5923",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1137",
        "name": "WUSQA INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "92524569293",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5924",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1138",
        "name": "XPRESS LOGISTICES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5926",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1142",
        "name": "ZADAF ( PVT ) LTD.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "5927",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "1212",
        "name": "ACA INTERNATIONAL (HONG KONG) LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "+852 3101 1433",
        "telephone2": "",
        "mobile1": "+852 9438 1209",
        "mobile2": "+852 3101 1499",
        "infoMail": "Sam.Chan@acaint.com",
        "website": "6020",
        "operations": "Sea Export, Air Import",
        "types": "Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "1755",
        "name": "SHARIF & ELAHI CORPORATION",
        "person1": "",
        "zip": "51040",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6185",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "1769",
        "name": "M.N. TEXTILES (PVT) LTD.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6187",
        "operations": "",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1773",
        "name": "SONIC TEXTILE INDUSTRIES (PVT) LTD.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6189",
        "operations": "Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "1774",
        "name": "DANIYAL ENTERPRISES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6190",
        "operations": "",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "1790",
        "name": "LEATHER COORDINATOR",
        "person1": "C/O A.F LOGISTIC",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6194",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1791",
        "name": "MAHEEN TEXTILE MILLS (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6195",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "1797",
        "name": "LANAM INTERNATIONAL",
        "person1": "C/O SMART FREIGHT",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6199",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1802",
        "name": "NUTEX INTERNATIONAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6203",
        "operations": "",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "1804",
        "name": "FAISAL FABRICS LTD.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6204",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "3",
        "code": "1805",
        "name": "A.L. GARMENTS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6205",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "1806",
        "name": "SIDDIQSONS LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6206",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "1807",
        "name": "THE DESIGNER",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6207",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "1808",
        "name": "EASTERN SPINNING MILLS LILMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6208",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "1809",
        "name": "B A TEXTILE",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6210",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "1810",
        "name": "TULIP TOWEL IND (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6211",
        "operations": "Sea Import, Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "1812",
        "name": "KAYSONS INTERNATIONAL (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6214",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "12010118",
        "name": "AL-GHOSIA IND",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6283",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010122",
        "name": "PERFECT FOOD INDUSTRIES",
        "person1": "",
        "zip": "54950",
        "telephone1": "009242-37009486",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6362",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "3",
        "code": "12010124",
        "name": "THREAD CONNECT",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6394",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "CU-00633",
        "name": "DURRANI ASSOCIATES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6423",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "CC-00884",
        "name": "HANA CARPET",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6522",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010128",
        "name": "SUNRISE ENTERPRISES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6674",
        "operations": "Sea Import, Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010130",
        "name": "BLUEJET ENTERPRISES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6675",
        "operations": "Sea Import",
        "types": "Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010131",
        "name": "SUBLI MASTER",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6676",
        "operations": "Sea Import",
        "types": "Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010132",
        "name": "STITCHWELL GARMENTS",
        "person1": "",
        "zip": "",
        "telephone1": "PHONE : 0301-8293686",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6678",
        "operations": "Sea Import, Air Import",
        "types": "Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "CU-00647",
        "name": "PAKISTAN INTERNATIONAL AIRLINES CORPORATION",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6770",
        "operations": "Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "CU-00013",
        "name": "PROLINE (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6805",
        "operations": "Sea Import, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "CU-00721",
        "name": "SAAR INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "-3612026",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "INFO@SAARIND.COM",
        "website": "6869",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "CU-00902",
        "name": "Sadaf Enterprises",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6871",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "CU-00146",
        "name": "SOORTY ENTERPRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "6944",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "CC-11914",
        "name": "IMRAN BROTHERS TEXTILE (PRIVATE) LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7068",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010139",
        "name": "REPSTER WEARS",
        "person1": "",
        "zip": "51040",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7083",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "3",
        "code": "12010144",
        "name": "RAJCO INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7084",
        "operations": "",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "12010151",
        "name": "ITTEFAQ TRADING CO.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7086",
        "operations": "",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "12010163",
        "name": "CREST ARTCRAFT",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7092",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "12010170",
        "name": "AIR & SEA LOGISTICS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7095",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010174",
        "name": "ENGLISH FASHION.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7096",
        "operations": "",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "12010176",
        "name": "Hilal Foods (Pvt.) Ltd.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7097",
        "operations": "",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "12010188",
        "name": "A.R. HOSIERY WORKS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7103",
        "operations": "",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "12010194",
        "name": "HERMAIN ENTERPRISE",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7104",
        "operations": "",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "12010198",
        "name": "ALLIED TRADING CORPORATION",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7106",
        "operations": "",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "12010200",
        "name": "LUCERNA TRADING DMCC C/OF: ABM INFO TECH (PVT) LTD",
        "person1": "Muhammad ILyas",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7107",
        "operations": "Sea Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010215",
        "name": "WORLD G CORPORATION",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7112",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010217",
        "name": "H.NIZAM DIN AND SONS (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7113",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010231",
        "name": "ANSA INDUSTRIES.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7115",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010232",
        "name": "SCS EXPRESS PVT LTD CUSTOMER",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7116",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "12010234",
        "name": "SPONA SPORTS.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7117",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010238",
        "name": "AHMED FINE WEAVING LTD.,",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7119",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010239",
        "name": "COLONY TEXTILE MILLS LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7120",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010240",
        "name": "NISHAT (CHUNIAN) LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7121",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010242",
        "name": "ROBIQA ENTERPRISES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7122",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010251",
        "name": "FIRST STONE CORPORATION PVT LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7126",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010257",
        "name": "MARK ONE SURGICAL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7127",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010260",
        "name": "SAMZ APPAREL ( PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7128",
        "operations": "",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "12010273",
        "name": "SUNRISE EXPORTS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7129",
        "operations": "",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "12010278",
        "name": "FULLMOON ENTERPRISES.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7130",
        "operations": "Sea Export, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010281",
        "name": "ABDUL WASI ULFAT S/O ABDUL HADI ULFAT",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7132",
        "operations": "Sea Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010294",
        "name": "PAKISTAN NAVY C/O COMMANDING OFFICER",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7134",
        "operations": "Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010297",
        "name": "SHAFI LIFESTYLE (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7135",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010299",
        "name": "Raheel Amanullah",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7136",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "3",
        "code": "12010300",
        "name": "Raheel @ Amanullah",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7137",
        "operations": "",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "12010302",
        "name": "DARSON INDUSTRIES (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7139",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010307",
        "name": "WITTVOLK EUROPE INTERNATIONAL GENERAL TRADING LLC",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7141",
        "operations": "Sea Import, Sea Export, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010316",
        "name": "ZIA OOCL LOG",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "NULL",
        "operations": "Sea Import, Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010317",
        "name": "GE HYDRO FRANCE",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7144",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "3",
        "code": "12010319",
        "name": "OOCL LOG (ZIA)",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7145",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010333",
        "name": "F.B. INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7150",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010339",
        "name": "AL TAYYIBA APPAREL.,",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7153",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010340",
        "name": "JAGUAR APPAREL (PRIVATE) LIMITED",
        "person1": "Mr. Naeem",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7154",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010346",
        "name": "SULTANIA GARMENTS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7155",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010351",
        "name": "DANCO FRESH",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7156",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010356",
        "name": "EMBASSY OF DENMARK.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7159",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010388",
        "name": "AL-MADINAH ISLAMIC RESEARCH CENTRE",
        "person1": "MR. JAMSHED SULTAN,",
        "zip": "",
        "telephone1": "-3333574593",
        "telephone2": "",
        "mobile1": "-3333574593",
        "mobile2": "",
        "infoMail": "JAMSHED.AWAN100@GMAIL.COM, KAMRANYASIN@MIRC.ORG.PK",
        "website": "7164",
        "operations": "Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010391",
        "name": "THE ORGANIC MEAT COMPANY",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7166",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010394",
        "name": "RANS INTL FREIGHT FOWARDING CO",
        "person1": "MS.SABA",
        "zip": "",
        "telephone1": "92-21-32275030-31",
        "telephone2": "0321-2289000",
        "mobile1": "0321-2289000",
        "mobile2": "92-21-32625686",
        "infoMail": "sabamendhro@ransintl.com",
        "website": "7167",
        "operations": "Sea Export, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010398",
        "name": "TAHIR CARPETS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7169",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010400",
        "name": "AERTEX SPORTS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7170",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010405",
        "name": "ARRIZA GROUP",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7171",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010415",
        "name": "QST INTERNATIONAL.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7173",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010419",
        "name": "JAGUAR APPAREL (PRIVATE) LIMITED.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7175",
        "operations": "",
        "types": "Shipper, Consignee, Notify"
    },
    {
        "PartyTypeId": "1",
        "code": "12010421",
        "name": "TROUT APPAREL",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7176",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010424",
        "name": "TRIMCO PAKISTAN (PRIVATE) LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7177",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "3",
        "code": "12010432",
        "name": "GARATEX IND",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7180",
        "operations": "Sea Import, Sea Export, Air Import, Air Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "12010433",
        "name": "NLC MARINE & AIR SERVICES.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7181",
        "operations": "Sea Export, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010439",
        "name": "DALDA FOODS LIMITED.",
        "person1": "SHAHID ANSARI",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7183",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010441",
        "name": "MEZAN TEA (PRIVATE) LIMITED",
        "person1": "M.Ilhan Khan",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7184",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010442",
        "name": "THE PARACHA TEXTILE MILLS LTD",
        "person1": "M.Ilhan Khan",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7185",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010444",
        "name": "JAVED AHMED KAIMKHANI",
        "person1": "",
        "zip": "",
        "telephone1": "TEL: +12894008000",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "JAVED@MILL-TEX.COM",
        "website": "7186",
        "operations": "Sea Import, Sea Export, Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010446",
        "name": "JAY + ENN SAFETY",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7187",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010454",
        "name": "THAR COAL BLOCK-1 POWER GENERATION COMPANY (PVT) L",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7188",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010469",
        "name": "SNA TRADERS.CO",
        "person1": "Noor Alam",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "snatraders.co@gmail.com",
        "website": "7194",
        "operations": "Sea Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010477",
        "name": "HUGO SPORT PAK",
        "person1": "UMAR",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7195",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010479",
        "name": "STITCHWELL GARMENTS.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7196",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010481",
        "name": "ROOMI FABRICS LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7197",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010482",
        "name": "MASOOD FABRICS LIMITED.",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7198",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010484",
        "name": "UNIVERSAL CABLES INDUSTRIES LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "'Ubaid Maqsood' <ubaid@ucil.com.pk>",
        "website": "7199",
        "operations": "Sea Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010497",
        "name": "NAZ TEXTILES (PVT) LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7203",
        "operations": "",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "12010514",
        "name": "KHALID OVERSEAS CORPORATION",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7202",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010518",
        "name": "CENTRAL SURGICAL CO. (PVT) LTD.,",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7204",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010523",
        "name": "GOHAR TEXTILE MILLS PVT LTD",
        "person1": "FAZAL",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7206",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010525",
        "name": "PERFECT GLOVES MANUFACTURER CO (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7207",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010527",
        "name": "ABRAR ENTERPRISES",
        "person1": "INAM",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7208",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010530",
        "name": "ECO GREEN / UK COURIER",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7209",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010537",
        "name": "CRETESOL (PRIVATE) LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7210",
        "operations": "Sea Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010539",
        "name": "AOL APPAREL PRIVATE LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7211",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010551",
        "name": "RANA IMPEX",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7215",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010557",
        "name": "Blow Plast (Pvt) Limited",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7218",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010561",
        "name": "PAK FASHEO CLOTHING COMPANY",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "www.pakfasheo.com",
        "website": "7220",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "3",
        "code": "12010564",
        "name": "IMRAN @ ALLIED LOG",
        "person1": "IMRAN",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7222",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "12010565",
        "name": "ANABIA GARMENTS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7223",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010570",
        "name": "PIK PAK INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7225",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010572",
        "name": "QASIM INTERNATIONAL CONTAINER TERMINAL PAKISTAN LT",
        "person1": "SAAD AHMED",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7226",
        "operations": "Sea Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010589",
        "name": "Jilani Shipping International",
        "person1": "",
        "zip": "",
        "telephone1": "0092-3018204493",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7229",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010597",
        "name": "SHEIKH MUHAMMAD SAEED & SONS",
        "person1": "",
        "zip": "74000",
        "telephone1": "+92 021 35054323",
        "telephone2": "",
        "mobile1": "-2119660",
        "mobile2": "",
        "infoMail": "smsleather@gmail.com",
        "website": "7231",
        "operations": "Sea Import",
        "types": "Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010608",
        "name": "ADAMJEE ENTERPRISES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7233",
        "operations": "Sea Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010622",
        "name": "SUNSHINE GLOVES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7237",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "3",
        "code": "12010628",
        "name": "SHAN CARGO",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7239",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010629",
        "name": "MASUM LOGISTICS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7240",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010631",
        "name": "CASUAL CLOTHING CO.",
        "person1": "'Abdul Wahab'",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "awahab@casual.net.pk",
        "website": "7241",
        "operations": "Air Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010633",
        "name": "KITARIYA BROTHERS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7242",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010639",
        "name": "VELOCITY SOLUTIONS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "+92 333 2289747",
        "mobile2": "",
        "infoMail": "",
        "website": "7243",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010642",
        "name": "GLOBEX SAFETY (PVT) LTD",
        "person1": "ARSHAD",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7244",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010650",
        "name": "AK GROUP",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7247",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010662",
        "name": "PERFORMANCE SURGICAL INSTRUMENTS",
        "person1": "",
        "zip": "",
        "telephone1": "0092 432 263703",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7248",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "3",
        "code": "12010664",
        "name": "SEAFREIGHT ADVISOR",
        "person1": "LIAQUAT ALI BAJWA",
        "zip": "51410",
        "telephone1": "92523257553",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7249",
        "operations": "Sea Export",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "12010665",
        "name": "ZIL LIMITED",
        "person1": "",
        "zip": "74000",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7250",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010672",
        "name": "TEKNOKRAT",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7251",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010678",
        "name": "ECOM LOGISTIX",
        "person1": "",
        "zip": "",
        "telephone1": "0301-3184844",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7252",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010681",
        "name": "REMO SPORTS",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7253",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010688",
        "name": "CONTINENTAL TOWELS  (PVT) LTD",
        "person1": "SALEEM",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7255",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010700",
        "name": "KUMAIL GLOVES INDUSTRIES",
        "person1": "KUMAIL",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7258",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010703",
        "name": "CMYK SERVICES",
        "person1": "",
        "zip": "",
        "telephone1": "-35850691",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7260",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010718",
        "name": "GILLANI INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7261",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010731",
        "name": "MUSTHAFA IMRAN AHMED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7262",
        "operations": "Sea Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "3",
        "code": "12010743",
        "name": "ZAHID-(DO)",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7263",
        "operations": "Air Import",
        "types": "Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010759",
        "name": "PETRO SOURCING (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "35121604",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7266",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010761",
        "name": "CARE MEDICAL SUPPLIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7267",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010765",
        "name": "ALPINE INDUSTRIES",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "0092 321 551 2232",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7268",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "3",
        "code": "12010769",
        "name": "MURTAZA-PIA",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7270",
        "operations": "Air Import",
        "types": "Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010776",
        "name": "MDS COMPANY",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "3343888714",
        "mobile2": "",
        "infoMail": "",
        "website": "7271",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010781",
        "name": "KARIMA TEXTILE RECYCLER (PVT) LTD",
        "person1": "fahad",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7272",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010782",
        "name": "RAVI ENTERPRISES",
        "person1": "RAVI",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7273",
        "operations": "",
        "types": "Shipper"
    },
    {
        "PartyTypeId": "1",
        "code": "12010801",
        "name": "FAISAL SPINNING MILLS TLD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7278",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010804",
        "name": "GHANI GLASS LIMITED",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "0092 42 35172205",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7279",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010812",
        "name": "CP PAKISTAN",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7280",
        "operations": "",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010815",
        "name": "LIGHT PAK GLOBAL INDUSTRIES (PRIVATE) LIMITED",
        "person1": "MR.Usama Shafiq",
        "zip": "",
        "telephone1": "3354721092",
        "telephone2": "",
        "mobile1": "3354721092",
        "mobile2": "",
        "infoMail": "lightpak@cyber.net.pk",
        "website": "7281",
        "operations": "Sea Import",
        "types": "Shipper, Consignee"
    },
    {
        "PartyTypeId": "1",
        "code": "12010816",
        "name": "ARTISTIC MILLINERS (PVT) LTD",
        "person1": "",
        "zip": "",
        "telephone1": "",
        "telephone2": "",
        "mobile1": "",
        "mobile2": "",
        "infoMail": "",
        "website": "7282",
        "operations": "Sea Export",
        "types": "Shipper, Consignee"
    }
  ]
  let addresses = [ //Vendors, clients, Customer/vendors, Non-GL Parties
    {
        "code": "1",
        "address1": "H NO D-2 800 DOST MUHAMMAD JUNJHAR GOTH NEAR NEW STAR SABZI MANDI",
        "address2": " "
    },
    {
        "code": "2",
        "address1": "4 HARPER STREET ROCHDALE LANCASHIRE OL 11 3RQ UK MANCHESTER",
        "address2": " "
    },
    {
        "code": "3",
        "address1": "",
        "address2": " "
    },
    {
        "code": "4",
        "address1": "",
        "address2": " "
    },
    {
        "code": "5",
        "address1": "PLOT NO 9, ST 13-1, SECTOR 6-B\r\nNORTH KARACHI INDUSTRIAL AREA\r\nKARACHI PAKISTAN\r\n\r\n\r\n",
        "address2": " "
    },
    {
        "code": "6",
        "address1": "B.11 Abbas Town Gulshan-e-Iqbal ",
        "address2": "Karachi-Pakistan "
    },
    {
        "code": "7",
        "address1": "PLOT NO F495 PORTION C GROUND FLOOR SITE KARACHI",
        "address2": " "
    },
    {
        "code": "8",
        "address1": "39-C/D, Block-6, P.E.C.H.S,\r\nMain Shahrah-e-Faisal, Opp. Citi Bank,\r\nKarachi-75400 Pakistan\r\n",
        "address2": " "
    },
    {
        "code": "9",
        "address1": "403/1, SUMYA APARTMENT, BLOCK 3, C.P BERAR SOCIETY, SHARFABAD,\r\nKARACHI, PAKISTAN.\r\n",
        "address2": " "
    },
    {
        "code": "10",
        "address1": "PLOT NO 157/D SECTOR 24",
        "address2": "KORANGI INDUSTRIAL AREA, KARACHI PAKISTAN "
    },
    {
        "code": "11",
        "address1": "SIDDIQSONS TOWER 6TH FLOOR MAIN \r\nSHAHRA-E-FAISAL KARACHI, PAKISTAN\r\nTEL: +92-21-34325161-63, FAX: +92-21-34325164\r\n",
        "address2": " "
    },
    {
        "code": "12",
        "address1": "",
        "address2": " "
    },
    {
        "code": "13",
        "address1": "D-7 S.I.T.E SUPERHIGHWAY SCHEME 33 \t",
        "address2": "KARACHI PAKISTAN "
    },
    {
        "code": "14",
        "address1": "51-52 WAHDAT TOWN, SATIANA ROAD.\r\nFAISALABAD (PAKISTAN)\r\n",
        "address2": " "
    },
    {
        "code": "15",
        "address1": "6 KM DASKA ROAD SIALKOT 51310 PAKISTAN",
        "address2": " "
    },
    {
        "code": "16",
        "address1": "G33 & G34, Centrum Shopping Mall \r\nRashid Minhas Road, F. B. Area, Block 21 Karachi - Pakistan \r\nNTN # 3728054-6\r\n",
        "address2": " "
    },
    {
        "code": "17",
        "address1": "OFFICE # 1 2ND FLOOR AMANA TOWER",
        "address2": "PECO ROAD LAHORE "
    },
    {
        "code": "18",
        "address1": "ADD.:PLOT NO.H23/3 SHED NO 1 LANDHI INDUSTRIAL AREA,MALIR BIM QASIM TOWN KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "19",
        "address1": "PLOT NO. 73, SECTOR 24, \r\nKORANGI INDUSTRIAL AREA,\r\nKARACHI 74900,PAKISTAN \r\n\r\n",
        "address2": " "
    },
    {
        "code": "20",
        "address1": "B-19,S.I.T.E.SUPER HIGHWAY \r\nKARACHI,PAKISTAN",
        "address2": " "
    },
    {
        "code": "21",
        "address1": "1088/2, JAIL ROAD, FAISALABAD, PAKISTAN",
        "address2": " "
    },
    {
        "code": "22",
        "address1": "PLOT NO. 7, 8, 9 SECTOR NO.16,\r\nKORANGI INDUSTRIAL AREA,\r\nKARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "23",
        "address1": "",
        "address2": " "
    },
    {
        "code": "24",
        "address1": "",
        "address2": " "
    },
    {
        "code": "25",
        "address1": "A-16/A, S.I.T.E., \r\nKARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "26",
        "address1": "A-16/A, S.I.T.E., \r\nKARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "27",
        "address1": "117\r\nJ. B NEAR PAHARANG DRAINAGE MILLAT ROAD DHONALA, FAISALABAD, PAKISTAN",
        "address2": " "
    },
    {
        "code": "28",
        "address1": "ISMAIL AIWAN-E-SCIENCE OFF SHAHRAH-E-ROOMI LAHORE 54600 PAKISTAN",
        "address2": " "
    },
    {
        "code": "29",
        "address1": "PLOT NO 72 SECTOR 15 KORANGI INDUSTRIAL AREA KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "30",
        "address1": "D-107 TEXTILE AVENUE S..I.T.E., KARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "31",
        "address1": "\r\nADD: A-54, S.M.C.H.S KARACHI - PAKISTAN\r\nNTN- 0676322-0\r\n",
        "address2": " "
    },
    {
        "code": "32",
        "address1": "UNIVERSAL HOUSE P-17/1 NEW CIVIL LINES BILAL ROAD FAISLABAD PAKISTAN",
        "address2": " "
    },
    {
        "code": "33",
        "address1": "BESTWAY BUILDING, 19-A F-7 MARKAZ\r\nISLAMABAD PAKISTAN",
        "address2": " "
    },
    {
        "code": "34",
        "address1": "UMER HOUSE 23/1 SECTOR 23 S.M FAROOQ ROAD KORANGI INDUSTRIAL AREA KARACHI",
        "address2": " "
    },
    {
        "code": "35",
        "address1": "CITY TOWER, 6-KM, MAIN BOULEVARD GULBERG II, LAHORE PAKISTAN\r\n\r\n",
        "address2": " "
    },
    {
        "code": "36",
        "address1": "KARIM LODGE OPP. LABOUR COLONY,\r\nPASRUR ROAD, NIZAMABAD,\r\nSIALKOT 51310 PAKISTAN\r\n",
        "address2": " "
    },
    {
        "code": "37",
        "address1": "B-53, ESTATE AVENUE,\r\nS.I.T.E.,KARACHI-75700  PAKISTAN\r\n",
        "address2": " "
    },
    {
        "code": "38",
        "address1": "1/2 G, Block- 06,  PECHS, \r\nKarachi - Pakistan.",
        "address2": " "
    },
    {
        "code": "39",
        "address1": "SHEIKHUPURA ROAD, NEAR PSO PETROL PUMP,\r\nGUJRANWALA, PAKISTAN.\r\n",
        "address2": " "
    },
    {
        "code": "40",
        "address1": "PLOT NO.B-35,36 S.I.T.E-II,SUPER HIGHWAY,\r\nKARACHI-75350,PAKISTAN N.T.N NO.3670025-8\r\n",
        "address2": " "
    },
    {
        "code": "41",
        "address1": "P-219,YARN MARKET MONTGOMERY BAZR,\r\nFAISALABAD, PAKISTAN",
        "address2": " "
    },
    {
        "code": "42",
        "address1": "(PVT) LTD L-06, BLOCK-\r\n21, FEDERAL B.INDUSTRIAL AREA\r\nPO BOX 13731 KARACHI 75950 PAKISTAN",
        "address2": " "
    },
    {
        "code": "43",
        "address1": "NISHATABAD FAISALABAD, PAKISTAN",
        "address2": " "
    },
    {
        "code": "44",
        "address1": "M.SAIDPUR GONDAL ROAD\r\nSIALKOT, PAKISTAN.",
        "address2": " "
    },
    {
        "code": "45",
        "address1": "3/4 BLOCK NO 205, TANNERY ROAD\r\nKARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "46",
        "address1": "PLOT NO. 25/7 SECTORE 12-C NORTH KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "47",
        "address1": "7 A/K MAIN BOULEVARD GULBERD II",
        "address2": " "
    },
    {
        "code": "48",
        "address1": "BUSINESS CENTER ROOM NO 809,813,814 \r\n8TH FLOOR I.I.CHUNDRIGAR ROAD\r\nKARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "49",
        "address1": "22 KM OFF FEROZEPUR RD, SHAMI ST RAJA INDUSTRIAL PARK, LAHORE",
        "address2": " "
    },
    {
        "code": "50",
        "address1": "H. 16, STREET 21, F-6/2 P.O. BOX 1118\r\nISLAMABAD PAKISTAN",
        "address2": " "
    },
    {
        "code": "51",
        "address1": "Office No: 03, Suite D-213, DMCHS, \r\nSiraj-UD-Daula Road, Karachi, Pakistan \r\n",
        "address2": " "
    },
    {
        "code": "52",
        "address1": "UMER HOUSE ,23/1 SECTOR 23,S.M. FAROOQ ROAD, KORANGI INDUSTRIAL AREA \r\nKARACHI  74900 PAKISTAN\r\n\r\n",
        "address2": " "
    },
    {
        "code": "53",
        "address1": "OFFICE NO 5, MEZZANINE FLOOR,BOMBAY PLAZA,BOHRI, ROAD,OPP.CUSTOM HOUSE,KARACHI.",
        "address2": " "
    },
    {
        "code": "54",
        "address1": "H-23, LANDHI INDUSTRIAL AREA,\r\nKARACHI, SINDH,  73120, PAKISTAN",
        "address2": " "
    },
    {
        "code": "55",
        "address1": "TOORABAD DASKA ROAD SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "56",
        "address1": "MAIN DASKA ROAD SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "57",
        "address1": "PLOT NO.25/7 1st FLOOR , SECTOR 12C INDUSTRIAL AREA,\r\nNORTH KARACHI , KARACHI CENTRAL NORTH KARACHI TOWN.\r\n",
        "address2": " "
    },
    {
        "code": "58",
        "address1": "PLOT NO  23, GROUND FLOOR, BLOCK-A\r\nSECTOR 12-D NORTH KARACHI\r\nINDUTRIES AREA KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "59",
        "address1": "C-3/1,AL-HAMRA SQAURE,FL-10,BLOCK-E NORTH MAZIMABAD,KARACHI,PAKISTAN",
        "address2": " "
    },
    {
        "code": "60",
        "address1": "6-L, Block-6, P.E.C.H.S., Shahrah-e-Faisal,\r\nKarachi-75400. Pakistan.",
        "address2": " "
    },
    {
        "code": "61",
        "address1": "53/55-A S.I.E NO.2, GUJRANWAL PAKISTAN",
        "address2": " "
    },
    {
        "code": "62",
        "address1": "",
        "address2": " "
    },
    {
        "code": "63",
        "address1": "PLOT NO 32 SECTOR 7-A KORANGI INDUSTRIAL AREA KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "64",
        "address1": "PARK LANE TOWERS MALL OF LAHORE 1.FLOOR NO: 4,5,\r\n7, 172. TUFAIL ROAD CANTONTMENT LAHORE, PAKISTAN",
        "address2": " "
    },
    {
        "code": "65",
        "address1": "STREET NO 2, MOHALLA AHMAD PURA\r\nMURIDKE, PAKISTAN\r\n",
        "address2": " "
    },
    {
        "code": "66",
        "address1": "PLOT NO 30, SECTOR 28 KORANGI INDUSTRIAL AREA KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "67",
        "address1": "42-S DR.MAHMOOD HUSSAIN ROAD,\r\nP.E.C.H.S BLOCK\"6\", KARACHI - PAKISTAN.\r\n\r\n\r\n",
        "address2": " "
    },
    {
        "code": "68",
        "address1": "C-206 HUB INDUSTRIAL TRADING ,ESTATE HUB, BALOCHISTAN PAKISTAN",
        "address2": " "
    },
    {
        "code": "69",
        "address1": "PLOT NO. 21 SECTOR 7-A KORANGI KARACHI 74900 PAKISTAN",
        "address2": " "
    },
    {
        "code": "70",
        "address1": "174 ABU-BAKAR BLOCK, NEW GARDEN TOWN LAHORE",
        "address2": " "
    },
    {
        "code": "71",
        "address1": "AL SADIQ PLAZA P-157 RAILEWAY ROAD FAISALABAD PAKISTAN",
        "address2": " "
    },
    {
        "code": "72",
        "address1": "OFFICE NO 204 2ND FLOOR JALLANI TOWER M.N TOWER,\r\nM.A JINNAH ROAD KARACHI, PAKISTAN\r\n\r\n\r\n",
        "address2": " "
    },
    {
        "code": "73",
        "address1": "",
        "address2": " "
    },
    {
        "code": "74",
        "address1": "PLOT NO.1204, SECTOR 15 A-4,BUFFERZONE\r\nNORTH KARACHI,KARACHI\r\nNTN# 2811551\r\n",
        "address2": " "
    },
    {
        "code": "75",
        "address1": "D-232/A METROVILLE SITE, KARACHI PAKISTAN.",
        "address2": " "
    },
    {
        "code": "76",
        "address1": "P.O.BOX 553 SALEEM TOWN, PASRUR RAOD, SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "77",
        "address1": "PLOT NO. MII E 98, BLOCK B, SHER SHAH KARACHI,\r\nKARACHI WEST SITE TOWN\r\n",
        "address2": " "
    },
    {
        "code": "78",
        "address1": "PLOT NO. D-32, S.I.T.E.,\r\nKARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "79",
        "address1": "",
        "address2": " "
    },
    {
        "code": "80",
        "address1": "PLOT NO, 2&3 SECTOR A-VI\r\nKARACHI EXPORT PROCESSIONG ZONE\r\nKARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "81",
        "address1": "PLOT # 10, SECTOR C-III, \r\nPHASE-1, EPZ,\r\nKARACHI - PAKISTAN\r\n",
        "address2": " "
    },
    {
        "code": "82",
        "address1": "PLOT 181, SECTOR 23, KORANGI INDUSTRIAL AREA, KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "83",
        "address1": "SUITE # 1113, 11TH FLOOR,CHAPPAL PLAZA\r\nHASRAT MOHANI ROAD KARACHI-PAKISTAN\r\nPhone: 9221-32428841 Fax: 9221- 32419751 \r\n",
        "address2": " "
    },
    {
        "code": "84",
        "address1": "DIVISION) \r\n8-KM MANGA RAIWIND ROAD,\r\nLAHORE - PAKISTAN",
        "address2": " "
    },
    {
        "code": "85",
        "address1": "B-30 BLOCK B KHANDU GOAT, NORTHNIZAMABAD KARACHI",
        "address2": " "
    },
    {
        "code": "86",
        "address1": "Plot # E-14, Sector C-VII, Phase-I, EPZ, Karachi\r\nC/O UTOPIA TOWEL IND.\r\n",
        "address2": " "
    },
    {
        "code": "87",
        "address1": "CHEEMA SQUARE CAPTIAL ROAD,\r\nSIALKOT 51310- PAKISTAN",
        "address2": " "
    },
    {
        "code": "88",
        "address1": "PO BOX NO 1166 HARRAR WAZIRABAD ROAD",
        "address2": " "
    },
    {
        "code": "89",
        "address1": "",
        "address2": " "
    },
    {
        "code": "90",
        "address1": "L-14, BLOCK-21, RASHID MINHAS ROAD, SCHEME # 16, FEDERAL B INDUSTRIAL AREA, KARACHI, Karachi Central Gulberg Town",
        "address2": "KARACHI-PAKISTAN "
    },
    {
        "code": "91",
        "address1": "L/8 BLOCK 21 F.B. INDUSTRIAL AREA",
        "address2": " "
    },
    {
        "code": "92",
        "address1": "DEFENCE ROAD HADI TOWN NEAR BUTT FOOT WEAR (PVT) LTD SIALKOT- PAKISTAN",
        "address2": " "
    },
    {
        "code": "93",
        "address1": "PLOT NO. 25/7,BASEMENT\r\nSECTOR 12-C., NORTH KARACHI INDUSTRIAL AREA\r\nKARACHI - PAKISTAN\r\n",
        "address2": " "
    },
    {
        "code": "94",
        "address1": "OFFICE NO 218 2ND FLOOR PLOT NO G-7, BLOCK 9 NEAR 2 TALWAR 75600 CLIFTON KARACHI",
        "address2": " "
    },
    {
        "code": "95",
        "address1": "PLOT NO: 21 SECTOR 12-A NORTH KARACHI, INDUSTRIAL AREA KARACHI",
        "address2": " "
    },
    {
        "code": "96",
        "address1": "B-765 METROVIL # 1, S.I.T.E. \r\nKARACHI-75700,PAKISTAN",
        "address2": " "
    },
    {
        "code": "97",
        "address1": "",
        "address2": " "
    },
    {
        "code": "98",
        "address1": "PLOT #: 9 SECTOR 12-B NORTH KARACHI INDUSTRIAL AREA KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "99",
        "address1": "PLOT NO.D-58&59 N.W I ZONE, PORT QASIM\r\nKARACHI,PAKISTAN\r\n",
        "address2": " "
    },
    {
        "code": "100",
        "address1": "1-D 9/3 MANGHOPIR ROAD, QASBA, METROVILLE,\r\nKARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "101",
        "address1": "LTD. \r\nPLOT NO. 1-D 9/3 QASBA METROVILLE,\r\nMANGHOPIR ROAD KARACHI, PAKISTAN\r\nTEL: 0092-21-6697600-6693333. FAX: 0092-21-6697400",
        "address2": " "
    },
    {
        "code": "102",
        "address1": "PLOT NO 14 &15 SECTOR 24,\r\nKORANGI INDUSTRIAL AREA \r\nKARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "103",
        "address1": "175-S,QUAID-E-AZAM INDUSTRIAL ESTATE\r\nKOT LAKHPAT,TOWNSHIP,LAHORE,PAKISTAN",
        "address2": " "
    },
    {
        "code": "104",
        "address1": "F-61 - C, S.I.T.E.,",
        "address2": "KARACHI - PAKISTAN TEL #  021-256 9646, "
    },
    {
        "code": "105",
        "address1": "PLOT NO. B-17 ESTATE AVENUE ROOM # 1 & 4\r\nFIRST FLOOR, SITE, KARACHI",
        "address2": "PH: 021-32552011 FX : 021-32550046"
    },
    {
        "code": "106",
        "address1": "PLOT LX-5 SCHEME 3&4 LANDI INDUSTRIAL ESTATE KARACHI 74200 PAKISTAN",
        "address2": " "
    },
    {
        "code": "107",
        "address1": "",
        "address2": " "
    },
    {
        "code": "108",
        "address1": "22,BLOCK 7/8, MAIN TIPU SULTAN ROAD,\r\nKARACHI-PAKISTAN NTN.53321185\r\n",
        "address2": " "
    },
    {
        "code": "109",
        "address1": "7-BKORANGI INDUSTRIAL AREA KORANGI 74900 KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "110",
        "address1": "",
        "address2": " "
    },
    {
        "code": "111",
        "address1": "2ND FLOOR F-2 Z1 SITE, KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "112",
        "address1": "701-704 UNI PLAZA 11 CHUNDRIGAR ROAD KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "113",
        "address1": "OFFICE # 26 C. 4TH COMMERCIAL LANE ZAMZAMA COMMERCIAL DHA PHASE V. KARACHI",
        "address2": " "
    },
    {
        "code": "114",
        "address1": "HELMAND AFGHANISTAN T.L NO .D.39611",
        "address2": " "
    },
    {
        "code": "115",
        "address1": "",
        "address2": " "
    },
    {
        "code": "116",
        "address1": "KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "117",
        "address1": "27-E, MAIN KHAYABAN-E-JAMI,\r\nDHA PHASE II-EXT,\r\nKARACHI-75500, PAKISTAN.",
        "address2": " "
    },
    {
        "code": "118",
        "address1": "20-C MAIN KHAYABAN E SHAHBAZ DHA PHASE VI, KARACHI",
        "address2": " "
    },
    {
        "code": "119",
        "address1": "116/2 STREET 6, \r\nKHAYABAN E MUHAFIZ PHASE 7 DHA\r\nKARACHI,PAKISTAN\r\nNTN NO. 8240930\r\n",
        "address2": " "
    },
    {
        "code": "120",
        "address1": "6-B, 6 FLOOR BAHRIA COMPLEX IV CH KHALIQ-UZ-ZAMAN ROAD GIZRI KARACHI 75600 TEL: 35147970",
        "address2": " "
    },
    {
        "code": "121",
        "address1": "Corporate Headquarters, Korangi Creek Road, Karachi",
        "address2": " "
    },
    {
        "code": "122",
        "address1": "DSU 13 PAKISTAN STEEL  INDUSTRIAL ESTATE BIN QASIM KARACHI 75000 TAX ID",
        "address2": " "
    },
    {
        "code": "123",
        "address1": "SUIT # 383, 3RD FLOOR, AL RAWEEM TOWER SHARAH-E-LIAQUAT, \r\nKARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "124",
        "address1": "PLOT C26 SECTOR 24 KORANGI INDUSTRIAL AREA KARACHI",
        "address2": " "
    },
    {
        "code": "125",
        "address1": "F-4/D, S.I.T.E., KARACHI PIPE MILLS COMPOUND, KARACHI -PAKISTAN",
        "address2": " "
    },
    {
        "code": "126",
        "address1": "C-302, BLOCK-6 FEDERAL B AREA\r\nKARACHI-75950, PAKISTAN",
        "address2": " "
    },
    {
        "code": "127",
        "address1": "Formerly: E&P Equipments Marketing Company (Pvt.) Limited\r\nR18, Karakoram Enclave 2 Sector F-11/1  Islamabad-44000 Pakistan \r\n",
        "address2": " "
    },
    {
        "code": "128",
        "address1": "C-252, Block-6, P.E.C.H.S.,\r\nOff : Shahrah-e-Faisal,\r\nKarachi - Pakistan",
        "address2": " "
    },
    {
        "code": "129",
        "address1": "DASKA ROAD, SIALKOT,PAKISTAN",
        "address2": " "
    },
    {
        "code": "130",
        "address1": "LANGREALI KINGRA ROAD SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "131",
        "address1": "CONCORDIA PLAZA,STREET #2, BASEMENT\r\nSHOP,MUMTAZ CITY,ISLAMABAD \r\nNTN:# 7973776-1",
        "address2": " "
    },
    {
        "code": "132",
        "address1": "PLOT # C-153 SECTOR 6-F, MEHRAN TOWN\r\nKORANGI INDUSTRIAL AREA\r\nKARACHI-PAKISTAN NTN # 1150877-8\r\n",
        "address2": " "
    },
    {
        "code": "133",
        "address1": "527A,BLOCK A, GULSHAN-I-RAVI\r\nPK-54500 LAHORE PAKISTAN",
        "address2": " "
    },
    {
        "code": "134",
        "address1": "",
        "address2": " "
    },
    {
        "code": "135",
        "address1": "D-11, SOUTH AVENUE, S.I.T.E.,\r\nKARACHI-75700 PAKISTAN",
        "address2": " "
    },
    {
        "code": "136",
        "address1": "\t\t\r\nPlot # E2 Office # 101,102, First Floor S.I.T.E Avenue Road, \r\nDhedhi Business Avenue Karachi, Karachi West Site Town.\r\n",
        "address2": " "
    },
    {
        "code": "137",
        "address1": "Muzafarpur ugoki Road sialkot Pakistan",
        "address2": " "
    },
    {
        "code": "138",
        "address1": "3.5KM MANGA RAIWIND ROAD, RAIWIND, 54010 LAHORE PAKISTAN",
        "address2": " "
    },
    {
        "code": "139",
        "address1": "7/AK MAIN BOULEVARD GULBERG II LAHORE PAKISTAN",
        "address2": " "
    },
    {
        "code": "140",
        "address1": "ADDRESS | 22 KM SHEIKHPURA ROAD LAHORE\r\nTEL | (+92) 423 7168901-8 EXT (164)\r\nFAX (+92) 423 7168909\r\nCELL: | (+92) 0321-4400328, 321 7223823\r\n",
        "address2": " "
    },
    {
        "code": "141",
        "address1": "ANWAR KHAWAJA CHOWK\r\nHAJIPURA ROAD 51310\r\nSIALKOT, PAKISTAN\r\n\r\n",
        "address2": " "
    },
    {
        "code": "142",
        "address1": "NO 11 RODNEY STREET COLOMBO",
        "address2": " "
    },
    {
        "code": "143",
        "address1": "SUITE #608 CHAPAL PLAZA HASRAT MOHANI ROAD I.I.CHUNDIGAR ROAD KARACHI",
        "address2": " "
    },
    {
        "code": "144",
        "address1": "",
        "address2": " "
    },
    {
        "code": "145",
        "address1": "D-150 / A, S.I.T.E,\r\nKARACHI (PAKISTAN).",
        "address2": " "
    },
    {
        "code": "146",
        "address1": "SHAFI\r\nHOUSE, 35-A/3, MT KHAN ROAD,\r\nOPP BEACH LUXURY HOTEL KARACHI\r\n74000, PAKISTAN & PLOT NO.B-22 TO\r\nTO 26 & B-38 TO 42 H.I.T.E,\r\nDISTT. LASBELLA, BALOCHISTAN",
        "address2": " "
    },
    {
        "code": "147",
        "address1": "4 5K.M RAIWIND MANGA ROAD RAIWIND KASUR PAKISTAN",
        "address2": " "
    },
    {
        "code": "148",
        "address1": "SUITE # 1007 10TH FLOOR PARK AVENUE BLOCK-6 P.E.C.H.S KARACHI",
        "address2": " "
    },
    {
        "code": "149",
        "address1": "SK CASA, 390, POTOHAR ROAD (ST:16), I-9/3,\r\nISLAMABAD - PAKISTAN\r\n",
        "address2": " "
    },
    {
        "code": "150",
        "address1": "S.I.E BILAL PURA, ST NO. 6 UGOKI ROAD, SIALKOT 51310, PAKISTAN",
        "address2": " "
    },
    {
        "code": "151",
        "address1": "D-153/A, PATHAN COLONY S.I.T.E,KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "152",
        "address1": "MADINA COLONY,RANGER PURA ROAD\r\nSIALKOT 51310 PAKISTAN\r\nNTN#1966529-6\r\n",
        "address2": " "
    },
    {
        "code": "153",
        "address1": "PAKKI KOTLI, DASKA ROAD, SIALKOT 51310, PAKISTAN\r\n\r\n",
        "address2": " "
    },
    {
        "code": "154",
        "address1": "\r\n39C/D PECHS BLOCK 5, 75400\r\nKARACHI PAKISTAN\r\n\r\nC/O A.J WORLDWIDE SERVICE PAKISTAN (PVT) LTD\r\n",
        "address2": " "
    },
    {
        "code": "155",
        "address1": "KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "156",
        "address1": "PLOT # 17/2, SECTOR  12-C  NORTH  KARACHI  INDUSTRIAL  AREA             KARACHI - PAKISTAN.",
        "address2": " "
    },
    {
        "code": "157",
        "address1": "",
        "address2": " "
    },
    {
        "code": "158",
        "address1": "3-KM KASUR ROAD, ELLAH ABAD - 55230\r\nDISTRICT KASUR, PUNJAB, PAKISTAN.",
        "address2": " "
    },
    {
        "code": "159",
        "address1": "",
        "address2": " "
    },
    {
        "code": "160",
        "address1": "Suite # 617, 6th Floor, Trade Avenue, Hasrat Mohani Road, I. I. Chundrighar, Karachi - 74000, Pakistan.",
        "address2": " "
    },
    {
        "code": "161",
        "address1": "PLOT NO. B-12/C STATE AVENUE \r\nS.I.T.E KARACHI,PAKISTAN",
        "address2": " "
    },
    {
        "code": "162",
        "address1": "DASKA ROAD, ADDAH\r\nSIALKOT - PAKISTAN.",
        "address2": " "
    },
    {
        "code": "163",
        "address1": "CD-374,SECTOR-16/B GLOBAL TOWN, NEW YORK KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "164",
        "address1": "209 RB JARANWALA ROAD\r\nRoad, Faisalabad, Pakistan\r\n\r\n",
        "address2": " "
    },
    {
        "code": "165",
        "address1": "PLOT NO. 2 & 17, SECTOR 20,\r\nKORANGI INDUSTRIAL AREA,\r\nKARACHI-74900 [PAKISTAN]\r\n",
        "address2": " "
    },
    {
        "code": "166",
        "address1": "AHMAD PURA KHAN MAHAL ROAD SIALKOT-51310 PAKISTAN.",
        "address2": " "
    },
    {
        "code": "167",
        "address1": "PLOT NO. DP-7 SECTOR 12 - C, NORTH KARACHI INDUSTRIAL AREA\t\t\t\t",
        "address2": "KARACHI - PAKISTAN "
    },
    {
        "code": "168",
        "address1": "MALIK STREET CAPITAL ROAD\r\nSILAKOT, PAKISTAN, TEL : 00923328700817\r\nNTN: 7967599-7 \r\n",
        "address2": " "
    },
    {
        "code": "169",
        "address1": "PLOT #, C.16/A, S.I.T.E. SUPPER HIGHWAY SCHEME 33, PHASE-1,\r\nKARACHI CENTRAL NORTH KARACHI TOWN, KARACHI.PAKISTAN\r\n",
        "address2": " "
    },
    {
        "code": "170",
        "address1": "plot # 457 pmb colony near wazir manssion maripur road karachi",
        "address2": " "
    },
    {
        "code": "171",
        "address1": "Office No. 9 & 9A, 2nd Floor, Services Club Extension Building Mereweather Road Karachi - Pakistan.",
        "address2": " "
    },
    {
        "code": "172",
        "address1": "TECHNOLOGY DRIVE 14 KM PASRUR ROAD ",
        "address2": "SIALKOT PAKISTAN "
    },
    {
        "code": "173",
        "address1": "MASHALLAH RUBI APPERTMENT PLOT NO 20/9 5TH FLOOR NO 21 CANADIO VILLAGE PUNJAB CHORANGI",
        "address2": " "
    },
    {
        "code": "174",
        "address1": "HAIDER STREET NEKA PURA SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "175",
        "address1": "PLOT 14 SECTOR B-VIII EXPORT PROCESSING ZONE PO BOX 18685 KARACHI",
        "address2": " "
    },
    {
        "code": "176",
        "address1": "PLOT-14, SECTOR B-VIII, EXPORT \r\nPROCESSING ZONE , P.O BOX : 18685\r\nKARACHI-75150, PAKISTAN.",
        "address2": " "
    },
    {
        "code": "177",
        "address1": "ST.46, BLOCK 7, F.B.AREA\r\nKARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "178",
        "address1": "C-152, BLOCK \"A\" NORTH\r\nNAZIMABAD , KARACHI - PAKISTAN.",
        "address2": " "
    },
    {
        "code": "179",
        "address1": "4-T New Multan, Multan 60000 Pakistan",
        "address2": " "
    },
    {
        "code": "180",
        "address1": "PLOT NO: 25 SECTOR 12-C NORTH KARACHI INDUSTRIAL  AREA KARACHI",
        "address2": " "
    },
    {
        "code": "181",
        "address1": "",
        "address2": " "
    },
    {
        "code": "182",
        "address1": "",
        "address2": " "
    },
    {
        "code": "183",
        "address1": "",
        "address2": " "
    },
    {
        "code": "184",
        "address1": "SUITE # 114 - 1ST FLOOR, CLIFTON CENTER, BLOCK-5, CLIFTON, KARACHI, PAKISTAN.",
        "address2": " "
    },
    {
        "code": "185",
        "address1": "OFFICE# 102 PARK AVENUE, SHAHRAH-E-FAISAL, KARACHI PAKISTAN \r\n+92-213-4388011-15\r\n",
        "address2": " "
    },
    {
        "code": "186",
        "address1": "",
        "address2": " "
    },
    {
        "code": "187",
        "address1": "24 THIRD, TIMBER POND, PAK SHAHEEN AVENUE, KEAMARI, KARACHI",
        "address2": " "
    },
    {
        "code": "188",
        "address1": "",
        "address2": " "
    },
    {
        "code": "189",
        "address1": "",
        "address2": " "
    },
    {
        "code": "190",
        "address1": "",
        "address2": " "
    },
    {
        "code": "191",
        "address1": "1st FLOOR 85-C, 11TH COMMERCIAL STREET,\r\nPHASE-II DHA, KARACHI, PAKISTAN.\r\nTEL #: +92 21 35315929-32 (EXT:317).\r\nFAX #: +92 21 35315925.",
        "address2": " "
    },
    {
        "code": "192",
        "address1": "",
        "address2": " "
    },
    {
        "code": "193",
        "address1": "",
        "address2": " "
    },
    {
        "code": "194",
        "address1": "",
        "address2": " "
    },
    {
        "code": "195",
        "address1": "",
        "address2": " "
    },
    {
        "code": "196",
        "address1": "",
        "address2": " "
    },
    {
        "code": "197",
        "address1": "",
        "address2": " "
    },
    {
        "code": "198",
        "address1": "",
        "address2": " "
    },
    {
        "code": "199",
        "address1": "INTER-FREIGHT, KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "200",
        "address1": "",
        "address2": " "
    },
    {
        "code": "201",
        "address1": "",
        "address2": " "
    },
    {
        "code": "202",
        "address1": "",
        "address2": " "
    },
    {
        "code": "203",
        "address1": "",
        "address2": " "
    },
    {
        "code": "204",
        "address1": "A-301, 3rd Floor, Fortune Towers,Razi \r\nRoad,  Main Shahrah-e-Faisal, Karachi, Pakistan.",
        "address2": " "
    },
    {
        "code": "205",
        "address1": "30-C,STADIUM LANE #.4 KHAYABAN-E-SHAMSHEER NEAR ABDUL AZIZ MOSQUE D.H.A PHASE-V,KARACHI,PAK",
        "address2": " "
    },
    {
        "code": "206",
        "address1": "",
        "address2": " "
    },
    {
        "code": "207",
        "address1": "",
        "address2": " "
    },
    {
        "code": "208",
        "address1": "SEEDAT CHAMBERS DR. ZIAUDDIN AHMED ROAD, KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "209",
        "address1": "SUITE# 1006,10TH FLOOR, BUSINESS CENTER,\r\nMUMTAZ HASSAN ROAD,OFF :I.I CHUNDRIGAR ROAD, KARACHI-PAKISTAN.\r\nwww.idealog.com.pk",
        "address2": " "
    },
    {
        "code": "210",
        "address1": "",
        "address2": " "
    },
    {
        "code": "211",
        "address1": "",
        "address2": " "
    },
    {
        "code": "212",
        "address1": "",
        "address2": " "
    },
    {
        "code": "213",
        "address1": "",
        "address2": " "
    },
    {
        "code": "214",
        "address1": "",
        "address2": " "
    },
    {
        "code": "215",
        "address1": "",
        "address2": " "
    },
    {
        "code": "216",
        "address1": "C/O NYK LINE",
        "address2": " "
    },
    {
        "code": "217",
        "address1": "",
        "address2": " "
    },
    {
        "code": "218",
        "address1": "KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "219",
        "address1": "",
        "address2": " "
    },
    {
        "code": "220",
        "address1": "M-1, QUEEN'S CENTRE, MT. KHAN ROAD, KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "221",
        "address1": "",
        "address2": " "
    },
    {
        "code": "222",
        "address1": "",
        "address2": " "
    },
    {
        "code": "223",
        "address1": "SUITE # 713, 7TH FLOOR, CHAPAL PLAZA, HASRAT MOHANI ROAD, KARACHI - PAKISTAN.",
        "address2": " "
    },
    {
        "code": "224",
        "address1": "LTD",
        "address2": " "
    },
    {
        "code": "225",
        "address1": "",
        "address2": " "
    },
    {
        "code": "226",
        "address1": "",
        "address2": " "
    },
    {
        "code": "227",
        "address1": "PO Box 123058,\r\nFreight Center, Cargo Terminal - 2, \r\nOffice # 614 & 613 \r\nSharjah International Airport, Sharjah, UAE\r\n SAIFZONE Office:\r\nQ1-05-119/C\r\nSharjah Airport Freezone, Sharjah, UAE\r\nWebsite:",
        "address2": "www.skybizz.ae "
    },
    {
        "code": "228",
        "address1": "",
        "address2": " "
    },
    {
        "code": "229",
        "address1": "",
        "address2": " "
    },
    {
        "code": "230",
        "address1": "PAKISTAN (PVT.) LTD.",
        "address2": " "
    },
    {
        "code": "231",
        "address1": "1ST FLOOR, 22 WEST WHARF ROAD, KARACHI-74000",
        "address2": " "
    },
    {
        "code": "232",
        "address1": "",
        "address2": " "
    },
    {
        "code": "233",
        "address1": "",
        "address2": " "
    },
    {
        "code": "234",
        "address1": "",
        "address2": " "
    },
    {
        "code": "235",
        "address1": "",
        "address2": " "
    },
    {
        "code": "236",
        "address1": "",
        "address2": " "
    },
    {
        "code": "237",
        "address1": "",
        "address2": " "
    },
    {
        "code": "238",
        "address1": "SHENZHEN BRANCH RM1804, GUIDU BUILDING, CHUNFENG RO. LUOHU DISTRICT, SHENZHEN, CHINA 518001",
        "address2": " "
    },
    {
        "code": "239",
        "address1": "No.41-02, Jalan Harmonium 23/14, \r\nTaman Desa Tebrau, 81100 \r\nJohor Bahru, Johor\r\n",
        "address2": " "
    },
    {
        "code": "240",
        "address1": "Landmark Building (7th Fl.)12-14,Gulshan North\r\nC/A,Gulshan-2,Dhaka-1212,Bangladesh\r\n",
        "address2": " "
    },
    {
        "code": "241",
        "address1": "181 S. Franklin Ave. Suite 609 Valley Stream, NY 11581\r\n",
        "address2": " "
    },
    {
        "code": "242",
        "address1": "19F, Jongno Tower, 51, Jong-ro, Jongno-gu, Seoul, Korea (Zip code: 03161)",
        "address2": " "
    },
    {
        "code": "243",
        "address1": "Premier Kampus Ofis Gursel Mahallesi Imrahor Caddesi No:29/A Kat:6 Kagithane - Istanbul 34400  / Türkiye",
        "address2": " "
    },
    {
        "code": "244",
        "address1": "1981 BOYLEN ROAD UNIT # 8 & 9",
        "address2": "MISSISSAUGA, ON, CANADA TEL # 905 678 0000 EMAIL: OCEAN@CANWORLD.CA"
    },
    {
        "code": "245",
        "address1": "50-F BLOCK 6 PECHS KARACHI",
        "address2": " "
    },
    {
        "code": "246",
        "address1": "AVONDALE HOUSE, PHOENIX CRESCENT,                               \r\nSTRATHCLYDE BUSINESS PARK,",
        "address2": " "
    },
    {
        "code": "247",
        "address1": "UNIT 1805, TOWER 1, EVER GAIN PLAZA, NO.88 CONTAINER PORT ROAD, KWAI CHUNG, N.T., HK",
        "address2": " "
    },
    {
        "code": "248",
        "address1": "Floor 5,Building 3,Shatoujiao Bonded Area,Yantian,Shenzhen,Guangdong,P.R.C",
        "address2": " "
    },
    {
        "code": "249",
        "address1": "",
        "address2": " "
    },
    {
        "code": "250",
        "address1": "670 ORLY EVE, SUITE 201, MONTREAL, QC H9P 1E9",
        "address2": " "
    },
    {
        "code": "251",
        "address1": "P.O. Box 385022 Corporate Office: Dubai - UAE.",
        "address2": " "
    },
    {
        "code": "252",
        "address1": "P.O.BOX 23135\r\nMANAMA, KINGDOM OF BAHRAIN",
        "address2": " "
    },
    {
        "code": "253",
        "address1": "Optimum House, Clippers Quay, \r\nSalford, M50 3XP\r\n",
        "address2": " "
    },
    {
        "code": "254",
        "address1": "",
        "address2": " "
    },
    {
        "code": "255",
        "address1": "FR TOWER (11TH FLOOR) 32\r\nKEMAL ATATURK AVENUE, BANANI, DHAKA\r\n1213, BANGLADESH",
        "address2": " "
    },
    {
        "code": "256",
        "address1": "210 Free Trade Time Square No 39 XiangXing Fourth Road Huli District Xiamen 361006",
        "address2": " "
    },
    {
        "code": "257",
        "address1": "RUT 215001300017\r\nRINCON 531, 802\r\nMONTEVIDEO, URUGUAY\r\n\r\n\r\n \r\n\r\n",
        "address2": " "
    },
    {
        "code": "258",
        "address1": "Russian Federation, 190020\r\nSt.Petersburg Bumazhnaya str.,18,\r\nbuilding A1, office 310\r\nTel :+7 812 448 82 83 (ext.242)\r\nFax: +7 812 448 04 98\r\nmob. +7 921 304 31 66",
        "address2": " "
    },
    {
        "code": "259",
        "address1": "HOUSE # 5 3RD FLOOR ROAD # 7 BLOCK F BANANI DHAKA 1213 BANGLADESH",
        "address2": " "
    },
    {
        "code": "260",
        "address1": "AIN NO 101-113-550 206 A 3RD FLOOR,  TEJGAON INDUSTRIAL AREA DHAKA 1208, BANGLADESH ",
        "address2": " "
    },
    {
        "code": "261",
        "address1": "S.F.T. Gondrand Frères NV Noorderlaan 119 B5 B - 2030 Antwerpen - 3 BELGIUM",
        "address2": " "
    },
    {
        "code": "262",
        "address1": "RUA DR. PEDRO FERREIRA 155 18 ANDAR SALA 1802A ITAJAI - SANTA CATARINA -",
        "address2": "BRASIL CNPJ: 02.802.800/0001-51 "
    },
    {
        "code": "263",
        "address1": "HELTORFER STR. 6 40472 DUSSELDORF",
        "address2": " "
    },
    {
        "code": "264",
        "address1": "K Hrušovu 4/292, Praha 10, CZ-102 00\r\nCzech republic\r\n",
        "address2": " "
    },
    {
        "code": "265",
        "address1": "Setustu Inebolu Caddesi No: 39 \r\nKabatas, Beyoglu Istanbul - Turkey  \r\nTax Id&Nr: Beyoglu & 6080910554\r\n",
        "address2": " "
    },
    {
        "code": "266",
        "address1": "Maurice Ward & Co - CDG, 14 rue de la Perdrix - Les Vanneaux lot 119 BP 55048 Villepinte 95946 Roissy CDG Cedex",
        "address2": " "
    },
    {
        "code": "267",
        "address1": "UNIT 10, ST GEORGES BUSINESS CENTER ST GEORGES SQUARE PORTSMOUTH PO 1 3EZ",
        "address2": " "
    },
    {
        "code": "268",
        "address1": "KTT is Merkezi Kabatas Setustu Omer Avni Mah. Inebolu Sk. No. 51/5-6 34427 Beyoglu-Istanbul",
        "address2": " "
    },
    {
        "code": "269",
        "address1": "NNR MANCHESTER, 2ND FLOOR, BUILDING",
        "address2": "4 MANCHESTER GREEN, STYAL ROAD, MANCHESTER, M22 5LW, "
    },
    {
        "code": "270",
        "address1": "8550 W BRYN MAWR AVE, SUITE 400 CHICAGO IL 60631",
        "address2": " "
    },
    {
        "code": "271",
        "address1": "8, PLISKA STREET 9000 VARNA,",
        "address2": " "
    },
    {
        "code": "272",
        "address1": "5F,NO.209, SEC.3, CIVIC BLVD.,TAIPEI,TAIWAN",
        "address2": " "
    },
    {
        "code": "273",
        "address1": "",
        "address2": " "
    },
    {
        "code": "274",
        "address1": "",
        "address2": " "
    },
    {
        "code": "275",
        "address1": "Hasselager Centervej 15-17, DK-8260 Viby J, Denmark",
        "address2": " "
    },
    {
        "code": "276",
        "address1": "Rm 218 JiuSheng Building No.133 WuHua Road Shanghai China",
        "address2": "Cell phone:+86 13816548829 "
    },
    {
        "code": "277",
        "address1": "1902#,Block B,2018 South Securities Building, Jianshe Road, Luohu District, Shenzhen",
        "address2": " "
    },
    {
        "code": "278",
        "address1": "Head Office:\r\nHouse-59 (Level-6 Road-01, Block-I, Banani, Dhaka-1213, Bangladesh",
        "address2": " "
    },
    {
        "code": "279",
        "address1": "20910 NORMANDIE AVE, UNIT C \r\nTORRANCE, CA 90502\r\n\r\n\r\n",
        "address2": " "
    },
    {
        "code": "280",
        "address1": "",
        "address2": " "
    },
    {
        "code": "281",
        "address1": "POLITECHINEO 31 STREET 54626 THESSALONIKI",
        "address2": " "
    },
    {
        "code": "282",
        "address1": "IMMEUBLE LE CHALLENGER, 3 RUE DU FOUR 76008 ROUEN - FRANCE",
        "address2": " "
    },
    {
        "code": "283",
        "address1": "USA",
        "address2": " "
    },
    {
        "code": "284",
        "address1": "Level 4A, Valiant Towers, \r\n                  No 46/7, Nawam Mawatha, Colombo 02\r\n",
        "address2": " "
    },
    {
        "code": "285",
        "address1": "THURROCK PARK WAY, TILBURY, ESSEX, RM18 7HD \r\nCTC: DANIELLA WHITE T:01375 856 060 M: 07900 518173\r\n",
        "address2": " "
    },
    {
        "code": "286",
        "address1": "19401 SOUTH MAIN STREET, SUITE 202 GARDENA, CA 90248\r\n",
        "address2": " "
    },
    {
        "code": "287",
        "address1": "",
        "address2": " "
    },
    {
        "code": "288",
        "address1": "",
        "address2": " "
    },
    {
        "code": "289",
        "address1": "",
        "address2": " "
    },
    {
        "code": "290",
        "address1": "",
        "address2": " "
    },
    {
        "code": "291",
        "address1": "",
        "address2": " "
    },
    {
        "code": "292",
        "address1": "",
        "address2": " "
    },
    {
        "code": "293",
        "address1": "",
        "address2": " "
    },
    {
        "code": "294",
        "address1": "",
        "address2": " "
    },
    {
        "code": "295",
        "address1": "",
        "address2": " "
    },
    {
        "code": "296",
        "address1": "",
        "address2": " "
    },
    {
        "code": "297",
        "address1": "",
        "address2": " "
    },
    {
        "code": "298",
        "address1": "",
        "address2": " "
    },
    {
        "code": "299",
        "address1": "",
        "address2": " "
    },
    {
        "code": "300",
        "address1": "",
        "address2": " "
    },
    {
        "code": "301",
        "address1": "",
        "address2": " "
    },
    {
        "code": "302",
        "address1": "",
        "address2": " "
    },
    {
        "code": "303",
        "address1": "",
        "address2": " "
    },
    {
        "code": "304",
        "address1": "",
        "address2": " "
    },
    {
        "code": "305",
        "address1": "",
        "address2": " "
    },
    {
        "code": "306",
        "address1": "",
        "address2": " "
    },
    {
        "code": "307",
        "address1": "",
        "address2": " "
    },
    {
        "code": "308",
        "address1": "",
        "address2": " "
    },
    {
        "code": "309",
        "address1": "",
        "address2": " "
    },
    {
        "code": "310",
        "address1": "",
        "address2": " "
    },
    {
        "code": "311",
        "address1": "",
        "address2": " "
    },
    {
        "code": "312",
        "address1": "",
        "address2": " "
    },
    {
        "code": "313",
        "address1": "",
        "address2": " "
    },
    {
        "code": "314",
        "address1": "",
        "address2": " "
    },
    {
        "code": "315",
        "address1": "",
        "address2": " "
    },
    {
        "code": "316",
        "address1": "",
        "address2": " "
    },
    {
        "code": "317",
        "address1": "",
        "address2": " "
    },
    {
        "code": "318",
        "address1": "",
        "address2": " "
    },
    {
        "code": "319",
        "address1": "",
        "address2": " "
    },
    {
        "code": "320",
        "address1": "",
        "address2": " "
    },
    {
        "code": "321",
        "address1": "",
        "address2": " "
    },
    {
        "code": "322",
        "address1": "",
        "address2": " "
    },
    {
        "code": "323",
        "address1": "",
        "address2": " "
    },
    {
        "code": "324",
        "address1": "",
        "address2": " "
    },
    {
        "code": "325",
        "address1": "",
        "address2": " "
    },
    {
        "code": "326",
        "address1": "",
        "address2": " "
    },
    {
        "code": "327",
        "address1": "",
        "address2": " "
    },
    {
        "code": "328",
        "address1": "",
        "address2": " "
    },
    {
        "code": "329",
        "address1": "",
        "address2": " "
    },
    {
        "code": "330",
        "address1": "R-311, 3RD FLOOR RUBY CENTER TALPUR ROAD",
        "address2": " "
    },
    {
        "code": "331",
        "address1": "",
        "address2": " "
    },
    {
        "code": "332",
        "address1": "",
        "address2": " "
    },
    {
        "code": "333",
        "address1": "",
        "address2": " "
    },
    {
        "code": "334",
        "address1": "",
        "address2": " "
    },
    {
        "code": "335",
        "address1": "",
        "address2": " "
    },
    {
        "code": "336",
        "address1": "",
        "address2": " "
    },
    {
        "code": "337",
        "address1": "",
        "address2": " "
    },
    {
        "code": "338",
        "address1": "",
        "address2": " "
    },
    {
        "code": "339",
        "address1": "",
        "address2": " "
    },
    {
        "code": "340",
        "address1": "",
        "address2": " "
    },
    {
        "code": "341",
        "address1": "",
        "address2": " "
    },
    {
        "code": "342",
        "address1": "",
        "address2": " "
    },
    {
        "code": "343",
        "address1": "",
        "address2": " "
    },
    {
        "code": "344",
        "address1": "",
        "address2": " "
    },
    {
        "code": "345",
        "address1": "",
        "address2": " "
    },
    {
        "code": "346",
        "address1": "",
        "address2": " "
    },
    {
        "code": "347",
        "address1": "",
        "address2": " "
    },
    {
        "code": "348",
        "address1": "",
        "address2": " "
    },
    {
        "code": "349",
        "address1": "",
        "address2": " "
    },
    {
        "code": "350",
        "address1": "",
        "address2": " "
    },
    {
        "code": "351",
        "address1": "",
        "address2": " "
    },
    {
        "code": "352",
        "address1": "",
        "address2": " "
    },
    {
        "code": "353",
        "address1": "",
        "address2": " "
    },
    {
        "code": "354",
        "address1": "KARACHI,PAKISTAN",
        "address2": " "
    },
    {
        "code": "355",
        "address1": "LUFTVERKEHRS KG, SAATWINKLER DAMM 42-43, 13627 BERLIN",
        "address2": " "
    },
    {
        "code": "356",
        "address1": "",
        "address2": " "
    },
    {
        "code": "357",
        "address1": "",
        "address2": " "
    },
    {
        "code": "358",
        "address1": "",
        "address2": " "
    },
    {
        "code": "359",
        "address1": "",
        "address2": " "
    },
    {
        "code": "360",
        "address1": "",
        "address2": " "
    },
    {
        "code": "361",
        "address1": "",
        "address2": " "
    },
    {
        "code": "362",
        "address1": "",
        "address2": " "
    },
    {
        "code": "363",
        "address1": "",
        "address2": " "
    },
    {
        "code": "364",
        "address1": "",
        "address2": " "
    },
    {
        "code": "365",
        "address1": "",
        "address2": " "
    },
    {
        "code": "366",
        "address1": "",
        "address2": " "
    },
    {
        "code": "367",
        "address1": "UITE # 3-4, 1ST FLOOR, GSA HOUSE, 19 TIMBER POND KEAMARI KARACHI-PAKISTAN.",
        "address2": " "
    },
    {
        "code": "368",
        "address1": "SUITE 801-802, 8TH FLOOR, TRADE AVENUE,\r\nHASRAT MOHANI ROAD",
        "address2": " "
    },
    {
        "code": "369",
        "address1": "",
        "address2": " "
    },
    {
        "code": "370",
        "address1": "",
        "address2": " "
    },
    {
        "code": "371",
        "address1": "",
        "address2": " "
    },
    {
        "code": "372",
        "address1": "",
        "address2": " "
    },
    {
        "code": "373",
        "address1": "",
        "address2": " "
    },
    {
        "code": "374",
        "address1": "KARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "375",
        "address1": "",
        "address2": " "
    },
    {
        "code": "376",
        "address1": "",
        "address2": " "
    },
    {
        "code": "377",
        "address1": "",
        "address2": " "
    },
    {
        "code": "378",
        "address1": "",
        "address2": " "
    },
    {
        "code": "379",
        "address1": "",
        "address2": " "
    },
    {
        "code": "380",
        "address1": "IST FLOOR, PURI HOUSE, 22 WEST WHARF ROAD, KARACHI-74000, PAKISTAN.",
        "address2": " "
    },
    {
        "code": "381",
        "address1": "KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "382",
        "address1": "",
        "address2": " "
    },
    {
        "code": "383",
        "address1": "G.S.A. MOON TRAVEL",
        "address2": " "
    },
    {
        "code": "384",
        "address1": "",
        "address2": " "
    },
    {
        "code": "385",
        "address1": "",
        "address2": " "
    },
    {
        "code": "386",
        "address1": "",
        "address2": " "
    },
    {
        "code": "387",
        "address1": "",
        "address2": " "
    },
    {
        "code": "388",
        "address1": "",
        "address2": " "
    },
    {
        "code": "389",
        "address1": "",
        "address2": " "
    },
    {
        "code": "390",
        "address1": "",
        "address2": " "
    },
    {
        "code": "391",
        "address1": "",
        "address2": " "
    },
    {
        "code": "392",
        "address1": "",
        "address2": " "
    },
    {
        "code": "393",
        "address1": "SUIT 405 & 406-4TH FLOOR,CLIFTON CENTRE,CLIFTON BLOCK 5,KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "394",
        "address1": "",
        "address2": " "
    },
    {
        "code": "395",
        "address1": "",
        "address2": " "
    },
    {
        "code": "396",
        "address1": "",
        "address2": " "
    },
    {
        "code": "397",
        "address1": "",
        "address2": " "
    },
    {
        "code": "398",
        "address1": "KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "399",
        "address1": "",
        "address2": " "
    },
    {
        "code": "400",
        "address1": "Suite 403, 4th Floor, Business Plaza, Mumtaz Hassan Road, Off. I. I. Chundrigar Road, Karaqchi - 74000, Pakistan.",
        "address2": " "
    },
    {
        "code": "401",
        "address1": "",
        "address2": " "
    },
    {
        "code": "402",
        "address1": "",
        "address2": " "
    },
    {
        "code": "403",
        "address1": "",
        "address2": " "
    },
    {
        "code": "404",
        "address1": "",
        "address2": " "
    },
    {
        "code": "405",
        "address1": "",
        "address2": " "
    },
    {
        "code": "406",
        "address1": "",
        "address2": " "
    },
    {
        "code": "407",
        "address1": "",
        "address2": " "
    },
    {
        "code": "408",
        "address1": "SETH SHIPPING CORPORATION \r\nAGENTS FOR:LAUREL NAVIGATION (MAURITIUS) LIMITED 8&9, EFU HOUSE, GROUP FLOOR,M.A. JINNAH ROAD , KARACHI",
        "address2": " "
    },
    {
        "code": "409",
        "address1": "",
        "address2": " "
    },
    {
        "code": "410",
        "address1": "KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "411",
        "address1": "",
        "address2": " "
    },
    {
        "code": "412",
        "address1": "",
        "address2": " "
    },
    {
        "code": "413",
        "address1": "",
        "address2": " "
    },
    {
        "code": "414",
        "address1": "",
        "address2": " "
    },
    {
        "code": "415",
        "address1": "",
        "address2": " "
    },
    {
        "code": "416",
        "address1": "",
        "address2": " "
    },
    {
        "code": "417",
        "address1": "",
        "address2": " "
    },
    {
        "code": "418",
        "address1": "",
        "address2": " "
    },
    {
        "code": "419",
        "address1": "",
        "address2": " "
    },
    {
        "code": "420",
        "address1": "",
        "address2": " "
    },
    {
        "code": "421",
        "address1": "",
        "address2": " "
    },
    {
        "code": "422",
        "address1": "",
        "address2": " "
    },
    {
        "code": "423",
        "address1": "",
        "address2": " "
    },
    {
        "code": "424",
        "address1": "",
        "address2": " "
    },
    {
        "code": "425",
        "address1": "DUBAI AIRPORT CARGO VILLAGE, P.O BOX 4878 DUBAI, U.A.E",
        "address2": " "
    },
    {
        "code": "426",
        "address1": "",
        "address2": " "
    },
    {
        "code": "427",
        "address1": "",
        "address2": " "
    },
    {
        "code": "428",
        "address1": "",
        "address2": " "
    },
    {
        "code": "429",
        "address1": "",
        "address2": " "
    },
    {
        "code": "430",
        "address1": "",
        "address2": " "
    },
    {
        "code": "431",
        "address1": "",
        "address2": " "
    },
    {
        "code": "432",
        "address1": "",
        "address2": " "
    },
    {
        "code": "433",
        "address1": "",
        "address2": " "
    },
    {
        "code": "434",
        "address1": "",
        "address2": " "
    },
    {
        "code": "435",
        "address1": "",
        "address2": " "
    },
    {
        "code": "436",
        "address1": "",
        "address2": " "
    },
    {
        "code": "437",
        "address1": "",
        "address2": " "
    },
    {
        "code": "438",
        "address1": "",
        "address2": " "
    },
    {
        "code": "439",
        "address1": "",
        "address2": " "
    },
    {
        "code": "440",
        "address1": "",
        "address2": " "
    },
    {
        "code": "441",
        "address1": "",
        "address2": " "
    },
    {
        "code": "442",
        "address1": "",
        "address2": " "
    },
    {
        "code": "443",
        "address1": "",
        "address2": " "
    },
    {
        "code": "444",
        "address1": "",
        "address2": " "
    },
    {
        "code": "445",
        "address1": "",
        "address2": " "
    },
    {
        "code": "446",
        "address1": "",
        "address2": " "
    },
    {
        "code": "447",
        "address1": "450 HIGH ROAD ILFORD, ESSEX IGI IUU, UNITED KINGDOM.",
        "address2": " "
    },
    {
        "code": "448",
        "address1": "",
        "address2": " "
    },
    {
        "code": "449",
        "address1": "",
        "address2": " "
    },
    {
        "code": "450",
        "address1": "",
        "address2": " "
    },
    {
        "code": "451",
        "address1": "",
        "address2": " "
    },
    {
        "code": "452",
        "address1": "",
        "address2": " "
    },
    {
        "code": "453",
        "address1": "",
        "address2": " "
    },
    {
        "code": "454",
        "address1": "",
        "address2": " "
    },
    {
        "code": "455",
        "address1": "",
        "address2": " "
    },
    {
        "code": "456",
        "address1": "",
        "address2": " "
    },
    {
        "code": "457",
        "address1": "",
        "address2": " "
    },
    {
        "code": "458",
        "address1": "SHARJAH SAIF ZONE, SHARJAH, UAE P.O.BOX NO. 122568",
        "address2": " "
    },
    {
        "code": "459",
        "address1": "",
        "address2": " "
    },
    {
        "code": "460",
        "address1": "",
        "address2": " "
    },
    {
        "code": "461",
        "address1": "",
        "address2": " "
    },
    {
        "code": "462",
        "address1": "",
        "address2": " "
    },
    {
        "code": "463",
        "address1": "",
        "address2": " "
    },
    {
        "code": "464",
        "address1": "",
        "address2": " "
    },
    {
        "code": "465",
        "address1": "",
        "address2": " "
    },
    {
        "code": "466",
        "address1": "",
        "address2": " "
    },
    {
        "code": "467",
        "address1": "",
        "address2": " "
    },
    {
        "code": "468",
        "address1": "",
        "address2": " "
    },
    {
        "code": "469",
        "address1": "",
        "address2": " "
    },
    {
        "code": "470",
        "address1": "",
        "address2": " "
    },
    {
        "code": "471",
        "address1": "",
        "address2": " "
    },
    {
        "code": "472",
        "address1": "KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "473",
        "address1": "",
        "address2": " "
    },
    {
        "code": "474",
        "address1": "",
        "address2": " "
    },
    {
        "code": "475",
        "address1": "",
        "address2": " "
    },
    {
        "code": "476",
        "address1": "KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "477",
        "address1": "",
        "address2": " "
    },
    {
        "code": "478",
        "address1": "",
        "address2": " "
    },
    {
        "code": "479",
        "address1": "",
        "address2": " "
    },
    {
        "code": "480",
        "address1": "",
        "address2": " "
    },
    {
        "code": "481",
        "address1": "",
        "address2": " "
    },
    {
        "code": "482",
        "address1": "",
        "address2": " "
    },
    {
        "code": "483",
        "address1": "",
        "address2": " "
    },
    {
        "code": "484",
        "address1": "",
        "address2": " "
    },
    {
        "code": "485",
        "address1": "",
        "address2": " "
    },
    {
        "code": "486",
        "address1": "",
        "address2": " "
    },
    {
        "code": "487",
        "address1": "",
        "address2": " "
    },
    {
        "code": "488",
        "address1": "",
        "address2": " "
    },
    {
        "code": "489",
        "address1": "",
        "address2": " "
    },
    {
        "code": "490",
        "address1": "",
        "address2": " "
    },
    {
        "code": "491",
        "address1": "",
        "address2": " "
    },
    {
        "code": "492",
        "address1": "",
        "address2": " "
    },
    {
        "code": "493",
        "address1": "",
        "address2": " "
    },
    {
        "code": "494",
        "address1": "",
        "address2": " "
    },
    {
        "code": "495",
        "address1": "",
        "address2": " "
    },
    {
        "code": "496",
        "address1": "",
        "address2": " "
    },
    {
        "code": "497",
        "address1": "",
        "address2": " "
    },
    {
        "code": "498",
        "address1": "",
        "address2": " "
    },
    {
        "code": "499",
        "address1": "",
        "address2": " "
    },
    {
        "code": "500",
        "address1": "",
        "address2": " "
    },
    {
        "code": "501",
        "address1": "",
        "address2": " "
    },
    {
        "code": "502",
        "address1": "",
        "address2": " "
    },
    {
        "code": "503",
        "address1": "4TH FLOOR, P.N.S.C BUILDING MOULVI TAMIZ UDDIN KHAN ROAD, P.O.BOX 6187, KARACHI -74000.",
        "address2": " "
    },
    {
        "code": "504",
        "address1": "",
        "address2": " "
    },
    {
        "code": "505",
        "address1": "KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "506",
        "address1": "",
        "address2": " "
    },
    {
        "code": "507",
        "address1": "",
        "address2": " "
    },
    {
        "code": "508",
        "address1": "",
        "address2": " "
    },
    {
        "code": "509",
        "address1": "",
        "address2": " "
    },
    {
        "code": "510",
        "address1": "",
        "address2": " "
    },
    {
        "code": "511",
        "address1": "",
        "address2": " "
    },
    {
        "code": "512",
        "address1": "P.N.S.C. BUILDING, 4TH FLOOR, MOULVI TAMIZUDDIN KHAN ROAD, KARACHI-74000.",
        "address2": " "
    },
    {
        "code": "513",
        "address1": "",
        "address2": " "
    },
    {
        "code": "514",
        "address1": "",
        "address2": " "
    },
    {
        "code": "515",
        "address1": "",
        "address2": " "
    },
    {
        "code": "516",
        "address1": "BUSINESS CENTER, KARACHI",
        "address2": " "
    },
    {
        "code": "517",
        "address1": "",
        "address2": " "
    },
    {
        "code": "518",
        "address1": "",
        "address2": " "
    },
    {
        "code": "519",
        "address1": "",
        "address2": " "
    },
    {
        "code": "520",
        "address1": "",
        "address2": " "
    },
    {
        "code": "521",
        "address1": "",
        "address2": " "
    },
    {
        "code": "522",
        "address1": "",
        "address2": " "
    },
    {
        "code": "523",
        "address1": "",
        "address2": " "
    },
    {
        "code": "524",
        "address1": "",
        "address2": " "
    },
    {
        "code": "525",
        "address1": "",
        "address2": " "
    },
    {
        "code": "526",
        "address1": "",
        "address2": " "
    },
    {
        "code": "527",
        "address1": "",
        "address2": " "
    },
    {
        "code": "528",
        "address1": "18-C, 2nd Floor, Ittehad Lane 1, Phase VI, DHA, Karachi, Pakistan",
        "address2": " "
    },
    {
        "code": "529",
        "address1": "",
        "address2": " "
    },
    {
        "code": "530",
        "address1": "",
        "address2": " "
    },
    {
        "code": "531",
        "address1": "",
        "address2": " "
    },
    {
        "code": "532",
        "address1": "",
        "address2": " "
    },
    {
        "code": "533",
        "address1": "",
        "address2": " "
    },
    {
        "code": "534",
        "address1": "ROOM# 507, 5TH FLOOR BUSINESS PLAZA, OFF: I.I. CHUNDRIGAR ROAD KARACHI-PAKISTAN.",
        "address2": " "
    },
    {
        "code": "535",
        "address1": "",
        "address2": " "
    },
    {
        "code": "536",
        "address1": "509,5TH FLOOR BUSSINESS PLAZA, MUMTAZ HASSAN ROAD, OFF I. I. CHUNDRIGAR ROAD KARACHI",
        "address2": " "
    },
    {
        "code": "537",
        "address1": "",
        "address2": " "
    },
    {
        "code": "538",
        "address1": "KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "539",
        "address1": "",
        "address2": " "
    },
    {
        "code": "540",
        "address1": "CORRESPONDENCE ADDRESS: KHALID BIN WALEED STREET ",
        "address2": "P.O.BOX 23966.DUBI - U.A.E. "
    },
    {
        "code": "541",
        "address1": "813, PARK AVENUE BLOCK-6 PECHS KARACHI",
        "address2": " "
    },
    {
        "code": "542",
        "address1": "",
        "address2": " "
    },
    {
        "code": "543",
        "address1": "",
        "address2": " "
    },
    {
        "code": "544",
        "address1": "",
        "address2": " "
    },
    {
        "code": "545",
        "address1": "KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "546",
        "address1": "",
        "address2": " "
    },
    {
        "code": "547",
        "address1": "",
        "address2": " "
    },
    {
        "code": "548",
        "address1": "",
        "address2": " "
    },
    {
        "code": "549",
        "address1": "",
        "address2": " "
    },
    {
        "code": "550",
        "address1": "",
        "address2": " "
    },
    {
        "code": "551",
        "address1": "",
        "address2": " "
    },
    {
        "code": "552",
        "address1": "",
        "address2": " "
    },
    {
        "code": "553",
        "address1": "",
        "address2": " "
    },
    {
        "code": "554",
        "address1": "",
        "address2": " "
    },
    {
        "code": "555",
        "address1": "",
        "address2": " "
    },
    {
        "code": "556",
        "address1": "",
        "address2": " "
    },
    {
        "code": "557",
        "address1": "",
        "address2": " "
    },
    {
        "code": "558",
        "address1": "",
        "address2": " "
    },
    {
        "code": "559",
        "address1": "",
        "address2": " "
    },
    {
        "code": "560",
        "address1": "",
        "address2": " "
    },
    {
        "code": "561",
        "address1": "",
        "address2": " "
    },
    {
        "code": "562",
        "address1": "",
        "address2": " "
    },
    {
        "code": "563",
        "address1": "",
        "address2": " "
    },
    {
        "code": "564",
        "address1": "",
        "address2": " "
    },
    {
        "code": "565",
        "address1": "",
        "address2": " "
    },
    {
        "code": "566",
        "address1": "",
        "address2": " "
    },
    {
        "code": "567",
        "address1": "",
        "address2": " "
    },
    {
        "code": "568",
        "address1": "",
        "address2": " "
    },
    {
        "code": "569",
        "address1": "",
        "address2": " "
    },
    {
        "code": "570",
        "address1": "",
        "address2": " "
    },
    {
        "code": "571",
        "address1": "208-210, CHAPAL PLAZA, HASRAT MOHANI ROAD, KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "572",
        "address1": "",
        "address2": " "
    },
    {
        "code": "573",
        "address1": "",
        "address2": " "
    },
    {
        "code": "574",
        "address1": "",
        "address2": " "
    },
    {
        "code": "575",
        "address1": "",
        "address2": " "
    },
    {
        "code": "576",
        "address1": "",
        "address2": " "
    },
    {
        "code": "577",
        "address1": "",
        "address2": " "
    },
    {
        "code": "578",
        "address1": "",
        "address2": " "
    },
    {
        "code": "579",
        "address1": "",
        "address2": " "
    },
    {
        "code": "580",
        "address1": "",
        "address2": " "
    },
    {
        "code": "581",
        "address1": "",
        "address2": " "
    },
    {
        "code": "582",
        "address1": "",
        "address2": " "
    },
    {
        "code": "583",
        "address1": "",
        "address2": " "
    },
    {
        "code": "584",
        "address1": "",
        "address2": " "
    },
    {
        "code": "585",
        "address1": "Office # 305, 3rd Floor, Khayyam Chamber,\r\nBlock-2, PECHS, Shahrah e Faisal, \r\nMain Nursery, Karachi-Pakistan.   \r\nTel # +92-21-34380270-2\r\n",
        "address2": " "
    },
    {
        "code": "586",
        "address1": "",
        "address2": " "
    },
    {
        "code": "587",
        "address1": "",
        "address2": " "
    },
    {
        "code": "588",
        "address1": "",
        "address2": " "
    },
    {
        "code": "589",
        "address1": "",
        "address2": " "
    },
    {
        "code": "590",
        "address1": "",
        "address2": " "
    },
    {
        "code": "591",
        "address1": "",
        "address2": " "
    },
    {
        "code": "592",
        "address1": "",
        "address2": " "
    },
    {
        "code": "593",
        "address1": "",
        "address2": " "
    },
    {
        "code": "594",
        "address1": "",
        "address2": " "
    },
    {
        "code": "595",
        "address1": "",
        "address2": " "
    },
    {
        "code": "596",
        "address1": "SUIT# 512, 513, 5TH FLOOR, TRADE AVENUE, HASRAT MOHANI ROAD, KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "597",
        "address1": "",
        "address2": " "
    },
    {
        "code": "598",
        "address1": "",
        "address2": " "
    },
    {
        "code": "599",
        "address1": "",
        "address2": " "
    },
    {
        "code": "600",
        "address1": "",
        "address2": " "
    },
    {
        "code": "601",
        "address1": "",
        "address2": " "
    },
    {
        "code": "602",
        "address1": "",
        "address2": " "
    },
    {
        "code": "603",
        "address1": "",
        "address2": " "
    },
    {
        "code": "604",
        "address1": "",
        "address2": " "
    },
    {
        "code": "605",
        "address1": "",
        "address2": " "
    },
    {
        "code": "606",
        "address1": "",
        "address2": " "
    },
    {
        "code": "607",
        "address1": "",
        "address2": " "
    },
    {
        "code": "608",
        "address1": "",
        "address2": " "
    },
    {
        "code": "609",
        "address1": "",
        "address2": " "
    },
    {
        "code": "610",
        "address1": "",
        "address2": " "
    },
    {
        "code": "611",
        "address1": "",
        "address2": " "
    },
    {
        "code": "612",
        "address1": "",
        "address2": " "
    },
    {
        "code": "613",
        "address1": "",
        "address2": " "
    },
    {
        "code": "614",
        "address1": "",
        "address2": " "
    },
    {
        "code": "615",
        "address1": "",
        "address2": " "
    },
    {
        "code": "616",
        "address1": "KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "617",
        "address1": "",
        "address2": " "
    },
    {
        "code": "618",
        "address1": "",
        "address2": " "
    },
    {
        "code": "619",
        "address1": "",
        "address2": " "
    },
    {
        "code": "620",
        "address1": "",
        "address2": " "
    },
    {
        "code": "621",
        "address1": "",
        "address2": " "
    },
    {
        "code": "622",
        "address1": "",
        "address2": " "
    },
    {
        "code": "623",
        "address1": "KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "624",
        "address1": "",
        "address2": " "
    },
    {
        "code": "625",
        "address1": "",
        "address2": " "
    },
    {
        "code": "626",
        "address1": "ALTE PAPIERFABRIK 28-30 D-40699 ERKRATH TEL: +49 211 1682810",
        "address2": " "
    },
    {
        "code": "627",
        "address1": "ZONE 25 FEREEJ BIN DIRAH STREET 950 BIN DIRRAM BUILDING 5 UNIT 1 NAJMA DOHA QATAR",
        "address2": " "
    },
    {
        "code": "628",
        "address1": "CIBALI MH SALIHPASA CAD NOI5 KI3 UNKAPANI FATHI IST TURKEY",
        "address2": " "
    },
    {
        "code": "629",
        "address1": "SANAYI TICARET LIMITED SIRKETI SUMER MAHALLESI 8 SOKAK NO 50/C-B ZEYTIBURNU ISTANBUL TURKEY",
        "address2": " "
    },
    {
        "code": "630",
        "address1": "PRINCIPAL OFFICE BRANCH DHAKA",
        "address2": " "
    },
    {
        "code": "631",
        "address1": "GULSHAN BRANCH DHAKA",
        "address2": " "
    },
    {
        "code": "632",
        "address1": "33 GROUND FLOOR PARKLAND BUILDING PARK STREET COLOMBO 02 SRI LANKA ",
        "address2": "TEL: 94 11 433 1233 "
    },
    {
        "code": "633",
        "address1": "CALLE 5 SECTOR C OFICINA 201 ZONE FRANCA ADUANERA 08040 BARCELONA SPAIN",
        "address2": " "
    },
    {
        "code": "634",
        "address1": "DOCUMENTRAIRES 37 RUE DU SERGENT MICHEL BERTHET 69009 LYON FRANCE",
        "address2": " "
    },
    {
        "code": "635",
        "address1": "UNIT 6 ROSS COURT CENTRAL 132-140 ROSS COURT CLEVELAND QLD 4163 AUSTRALIA",
        "address2": " "
    },
    {
        "code": "636",
        "address1": "HOLLINGWORITH MILL SMITY BRIDGE ROAD LITTLEBORUGH LANCASHIRE ENGLAND OL 58QF",
        "address2": " "
    },
    {
        "code": "637",
        "address1": "BREITE STR 25 40213 DUSSELDORF",
        "address2": " "
    },
    {
        "code": "638",
        "address1": "DOKUMENTENGESCHAEFT BREITE STR",
        "address2": " "
    },
    {
        "code": "639",
        "address1": "COOPERATIVE VIA DEL LAVORO 6 8 40033 CASALECCHIO DI RENO BO ITALY",
        "address2": " "
    },
    {
        "code": "640",
        "address1": "2428 NEWCASTLE CRESCENT OAKVILLE L6M4P9 ONTARIO CANADA",
        "address2": " "
    },
    {
        "code": "641",
        "address1": "VULCAN HOUSE PRIORY ROCHESTER KENT ME2 2BD MANHESTER UNITED KINGDOM",
        "address2": " "
    },
    {
        "code": "642",
        "address1": "10101 SOUTH WEST FREEWAY HOUSTON",
        "address2": " "
    },
    {
        "code": "643",
        "address1": "ZAPADNI 75 797 32 PROSTEJOV CZECH REPUBLIC TEL: 420 582 314 411",
        "address2": " "
    },
    {
        "code": "644",
        "address1": "T2 TRAFFORD POINT TWINING ROAD TRAFFORD PARK MANCHESTER M17 1SH UK",
        "address2": "TEL: +44-42202175 "
    },
    {
        "code": "645",
        "address1": "NO 410/131 BAUDDHALOKA MAWATHA COLOMBO",
        "address2": " "
    },
    {
        "code": "646",
        "address1": "SERVICES GMBH JAPAN OFFICE DSG BLDG 3F 1-11-7 HAMAMATSUCHO MINATO-KU TOKYO 105-0013",
        "address2": " "
    },
    {
        "code": "647",
        "address1": "BANGLADESH LTD",
        "address2": " "
    },
    {
        "code": "648",
        "address1": "1400 BROADWAY 15/F NEW YORK NY 10018 USA",
        "address2": " "
    },
    {
        "code": "649",
        "address1": "GANGSEO BRANCH 340 HWAGOK-RO GANGSEO-GU SEOUL REPUBLIC OF KOREA SWIFT CZNBKRSEXXX",
        "address2": " "
    },
    {
        "code": "650",
        "address1": "BARTOSAVA ULICE 348 765 02 OTROKOVICE CZECH REPUBLIC TEL: 00420-601-329311",
        "address2": " "
    },
    {
        "code": "651",
        "address1": "BARTOSOVA 348 765 02 OTROKOVICE CZECH REPUBLIC",
        "address2": " "
    },
    {
        "code": "652",
        "address1": "296 STREET DUC THANG HEIPHOA BAC GIANG VIETNAM TEL: 84 04 3795 8472",
        "address2": " "
    },
    {
        "code": "653",
        "address1": "KOREA",
        "address2": " "
    },
    {
        "code": "654",
        "address1": "",
        "address2": " "
    },
    {
        "code": "655",
        "address1": "DUSSELDORFER STR 12 45481 MUELHEM AN DER RUHR GERMANY CONTACT PERSON MR MARCEL VIETZ PHONE +49 1520 5695290 0 CERTIFICATE NO DE NW 039 05452 BCD 2020 VI",
        "address2": " "
    },
    {
        "code": "656",
        "address1": "B.V AIR DIVISION CAPRONILAAN 12-20 1119 NR SCHIPHOL THE NETHERLANDS",
        "address2": " "
    },
    {
        "code": "657",
        "address1": "231 NEGOMBO ROAD WATTALA SRI LANKA",
        "address2": " "
    },
    {
        "code": "658",
        "address1": "WERE HOUSE/LIU-G 06 POST BOX#54652 DUBAI AIRPORT FREE ZONE DUABI UAE",
        "address2": " "
    },
    {
        "code": "659",
        "address1": "OFFICINE UNIVERSELLE BULY 6 RUE BONAPARTE 75006 PARIS FRNACE",
        "address2": " "
    },
    {
        "code": "660",
        "address1": "PLOT# 167-169 DHAKA EPZ AREA SAVAR DHAKA 1349 DHAKA BD",
        "address2": " "
    },
    {
        "code": "661",
        "address1": "BUILDING NO 24 PLOT  30 (B) KOREAN EXPORT PROCESSING ZONE KEPZ KARNAFULI PS CHITTAGONG 4376 BANGLADESH",
        "address2": " "
    },
    {
        "code": "662",
        "address1": "VIA C. LEVI NR.20/1 59100 PRATO PO ITALY VAT NR 02094240971",
        "address2": " "
    },
    {
        "code": "663",
        "address1": "320 FIFTH AVENUE 2ND FLOOR NEW YORK NY 10001 USA",
        "address2": " "
    },
    {
        "code": "664",
        "address1": "ASKRIDA TOWR 4TH FLOOR ROOM 401 JL PRAMUKA RAYA KAV 151 JAKARTA TIMUR 13120 INDONESIA TAX ID 03 282 994 7-001 000",
        "address2": " "
    },
    {
        "code": "665",
        "address1": "GARAHA ELIZABETH JI TANAH ABANG II",
        "address2": " "
    },
    {
        "code": "666",
        "address1": "JALAN RAYA PANTURA CIMOHONG RT RW 003 KELURAHAN CIMOHONG KECAMATAN BULAKAMBA KABUPATEN BREBES JAWA TENGAH KODE POS 52253 TELP (0283) 6180455 NPWP 83 067 479 2 501 000",
        "address2": " "
    },
    {
        "code": "667",
        "address1": "JL HAYAM WURUK NO 124 TAMAM SARI JAKARTA BARAT INDONESIA NPWP 01 77 659 2 004 000",
        "address2": " "
    },
    {
        "code": "668",
        "address1": "SAHID SUDIRMAN CENTER 26TH FLOOR",
        "address2": "JL JEAD SUDIRMAN KAV 86 KEL LARET TENGSIN KEC TANAH ABANG JAKARTA 10220 INDONESIA "
    },
    {
        "code": "669",
        "address1": "RENUKA HOUSE PO BOX 25 #69 SRI JINARATANA ROAD COLOMBO 02 SRILANKA TEL: 94 11 2314750 5 ",
        "address2": "FAX: 2445549 "
    },
    {
        "code": "670",
        "address1": "PO BOX 54176 ALQOUZ IND AREA 1 DUBAI UAE TEL +97143895700 FAX 043392949",
        "address2": " "
    },
    {
        "code": "671",
        "address1": "HONG DUNG COMMUNE THAI THUY",
        "address2": " "
    },
    {
        "code": "672",
        "address1": "NA VETROVE 83/55 14200 PRAHA 4- LHOTKA CZECH REPUBLIC",
        "address2": " "
    },
    {
        "code": "673",
        "address1": "POLIGONO INDUSTRIAL EL RAPOSAL II 26580 ARNEDO (LA RIOJA) SPAIN",
        "address2": " "
    },
    {
        "code": "674",
        "address1": "ROOM 102 BLD 2 18 MIKLUKHO MAKLAYA STR MOSCOW 117437 RUSSIA",
        "address2": " "
    },
    {
        "code": "675",
        "address1": "FACTORY OLIPUR SHAJIBAZAR SHAYESTAGONJ HOBIGONJ BANGLADESH CELL 01708 490030",
        "address2": " "
    },
    {
        "code": "676",
        "address1": "ZAMIRDIA VALUKA HARIBARI MYMENSINGH BANGLADESH CONTACT PERSON RASEL RANA",
        "address2": " "
    },
    {
        "code": "677",
        "address1": "GULSHAN AVENUE DHAKA",
        "address2": " "
    },
    {
        "code": "678",
        "address1": "DE WATERMAN 2 5215 MX S-HERTOGENBOSCH PO BOX 332 5201",
        "address2": " "
    },
    {
        "code": "679",
        "address1": "DE WATER,AN 2 5215 MX S-HERTOGNBOSCH THE NETHERLANDS",
        "address2": " "
    },
    {
        "code": "680",
        "address1": "DE WATERMAN 2 5215 MX S-HERTOGENBOSCH PO BOX 332 5201",
        "address2": " "
    },
    {
        "code": "681",
        "address1": "SOUTHBRIGE HOUSE SOUTHBRIGDE PLACE CROYDON SURREY CR0 4HA UK",
        "address2": " "
    },
    {
        "code": "682",
        "address1": "BIN 000002671-0002",
        "address2": " "
    },
    {
        "code": "683",
        "address1": "TRADE OPERATIONS DHAKA BANGLADESH",
        "address2": " "
    },
    {
        "code": "684",
        "address1": "THE CITY BANK LIMITED",
        "address2": " "
    },
    {
        "code": "685",
        "address1": "TRUIST BANK",
        "address2": " "
    },
    {
        "code": "686",
        "address1": "8 ELAINE PL PLAIVIEW, NY 11803 \r\nTEL: 718 730 3898 FAX 718 889 2486\r\nJABRAN@UTOPIADEALS.COM",
        "address2": " "
    },
    {
        "code": "687",
        "address1": "5215 OLD ORCHARD ROAD SUITE 725",
        "address2": " "
    },
    {
        "code": "688",
        "address1": "3/F 38 SOUTH XIHU 3RD ROAD SHILONG DONGGUAN GUANGDONG 523325 CHINA MR ARTHUR LEE TEL: +86 769 86180188",
        "address2": " "
    },
    {
        "code": "689",
        "address1": "111, PALLIDORA ROAD \r\nDEHIWELA \r\nSRILANKA",
        "address2": " "
    },
    {
        "code": "690",
        "address1": "NO 111 PALLIDORA ROAD DEHIWELA SRI LANKA",
        "address2": " "
    },
    {
        "code": "691",
        "address1": "HOUSE NO 111 C-2/11 NAZIMABAD ",
        "address2": "KARACHI PAKISTAN "
    },
    {
        "code": "692",
        "address1": "PLOT NO 322 2ND FLOOR LANE NO5 SECTOR A AKTHAR COLONY  KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "693",
        "address1": "Address: Suite No # 316,  3rd Floor Alma's Heights PECHS Main Shahr-e-Faisal Block 2 Karachi,Pakistan\r\n",
        "address2": " "
    },
    {
        "code": "694",
        "address1": "COURIER COMPANY KARACHI",
        "address2": " "
    },
    {
        "code": "695",
        "address1": "P-214, MUSLIM TOWN NO.1 SARGODHA\r\nROAD FAISALABAD, PAKISTAN",
        "address2": " "
    },
    {
        "code": "696",
        "address1": "PLOT NO, 284 SECTOR 27, K.I.A\r\nKARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "697",
        "address1": "G13 1ST FLOOR SATTAR CHAMBER 29 WEST WHARF ROAD KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "698",
        "address1": "PLOT NO. L-20C, BLOCK-22\r\nFEDERAL B AREA, KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "699",
        "address1": "KARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "700",
        "address1": "343-CAPT, SAROSH RD, MODEL TOWN\r\nSIALKOT 51310, PAKISTAN. PH: +92 52 355 0839.",
        "address2": " "
    },
    {
        "code": "701",
        "address1": "",
        "address2": " "
    },
    {
        "code": "702",
        "address1": "SMC PRIVATE LIMITED OFFICE NO 4 ABDALI TOWER NAWAN SHEHER CHOWK MULTAN CANTT",
        "address2": " "
    },
    {
        "code": "703",
        "address1": "LA-7/1-7, BLOCK-22, FEDERAL\"B\"AREA, KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "704",
        "address1": "BAY 70/71, JINNAH TERMINAL KARACHI SD 75200 PAKISTAN",
        "address2": " "
    },
    {
        "code": "705",
        "address1": "SITE NO 2 ALC BUILDING EXPORT/CARGO AREA JINNAH INTERNATIONAL AIRPORT",
        "address2": " "
    },
    {
        "code": "706",
        "address1": "BAY 72 JINNAH INTERNATIONAL  AIRPORT",
        "address2": "KARACHI PAKISTAN "
    },
    {
        "code": "707",
        "address1": "BAY 72, AIRSIDE\r\nJINNAH INTERNATIONAL AIRPORT\r\nKARACHI  75200 PKISTAN\r\n",
        "address2": " "
    },
    {
        "code": "708",
        "address1": "H.NO D-2/ 800 DEST MUHAMMAD JUNJHAR GOTH PAR 3 NEAR NEW SABZI MANDI KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "709",
        "address1": "B-52 RIZWAN HOUSING SOCIETY KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "710",
        "address1": "C 6 JUMANI ARCADE OLD MANDI UNIVERSITY ROAD KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "711",
        "address1": "RC-9, GULSHAN-E-ASGHAR P.O.\r\nKARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "712",
        "address1": "",
        "address2": " "
    },
    {
        "code": "713",
        "address1": "PLOT B 14 SEC 8-A/A AL HABIB CO KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "714",
        "address1": "",
        "address2": " "
    },
    {
        "code": "715",
        "address1": "Address: Plot # 212, Service Road East,\r\nSector I-10/3. Islamabad, Pakistan.\r\nIslamabad-44000, Pakistan \r\n",
        "address2": " "
    },
    {
        "code": "716",
        "address1": "G33 BLOCK 6, PECHS, OFF\r\nSHAHRAH E FAISAL KARACHI PAKISTAN\r\n",
        "address2": " "
    },
    {
        "code": "717",
        "address1": "P-265/3 D NEAR BLESSING HOME SCHOOL MAQBOOL ROAD, FAISALABAD,  PAKISTAN,\r\nPH NO. 0092 41 8540681,8724681,",
        "address2": " "
    },
    {
        "code": "718",
        "address1": "ADDRESS : F-130, CITI CENTER, \r\nMAIN SHAHRA E FAISAL \r\nKARACHI.\r\n",
        "address2": " "
    },
    {
        "code": "719",
        "address1": "MARKET OPENSHAN MANCHESTER M11 2WJ C/O AAA FREIGHT SERVICES LTD SUIT 2/3 48 GEORGE ST GLASGLOW UK G2 1BP",
        "address2": " "
    },
    {
        "code": "720",
        "address1": "B/20 BLOCK B BURMAH SHELL HOUSING SOCIETY KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "721",
        "address1": "GROUND MEZZANINE 1ST FLOOR",
        "address2": "PLOT SA-3& ST-7 SECTOR 5-L N.KARACHI, KARACHI - PAKISTAN. "
    },
    {
        "code": "722",
        "address1": "G-01, GROUND FLOOR, SIMRA TERRACE, GABOL STREET, NAZRETH ROAD OFF SOLDIER BAZAR, KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "723",
        "address1": "Plot # 122-C, Keamari Township, Keamari Karachi-75620, Pakistan",
        "address2": " "
    },
    {
        "code": "724",
        "address1": "M-5 MEZZANINE FLOOR FALAK NAZ PLAZA MAIN SHAHRA-E-FAISAL",
        "address2": "KARACHI-PAKISTAN "
    },
    {
        "code": "725",
        "address1": "PLOT NO. 27 SECTOR NO. 24, KORANGI INDUSTRIAL AREA, 74900-KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "726",
        "address1": "A-4, RAFIQ CHAMBER ZAKARIA LANE \r\nJODIA BAZAR KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "727",
        "address1": "ALI TRADING CO. (PVT) LTD.\r\n6 KM,DASKA ROAD,\r\nSIALKOT 51310, PAKISTAN.\r\n",
        "address2": " "
    },
    {
        "code": "728",
        "address1": "Suite # 01 Qasr-e- Tahir G Allana Road  ",
        "address2": "Kharadar Karachi-Pakista "
    },
    {
        "code": "729",
        "address1": "24-C SUNSET BOULEVARD PHASE 2 D.H.A KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "730",
        "address1": "HOUSE NO.1C-1/3, NAZIMABAD, NO.1,\r\nKARACHI CENTRAL LIAQUATABAD TOWN\r\nKARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "731",
        "address1": "61-Q BLOCK 6 PECHS KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "732",
        "address1": "KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "733",
        "address1": "CP. 2578 MUNO GOTH SABAZIMANDI KHI",
        "address2": " "
    },
    {
        "code": "734",
        "address1": "PLOT NO 38 INDUSTRIAL AREA KHUTTA ROAD ISLAMABAD PHN 92 51 4492380 81",
        "address2": " "
    },
    {
        "code": "735",
        "address1": "PLOT NO.26, SECTOR 12-A ,\t\t\t\r\nNORTH KARACHI INDUSTRIAL AREA\t\tKARACHI - PAKISTAN.\t\t\t\r\n",
        "address2": " "
    },
    {
        "code": "736",
        "address1": "ROOM NO 207/208 HASSAN CHAMBER BOHRI ROAD OPPOSITE NEW CUSTOM HOUSE",
        "address2": "KARACHI SINDH 74000 PAKISTAN "
    },
    {
        "code": "737",
        "address1": "ARABIAN ENTREPRISES 589A, PHASE 5 STREET NO. 25 DHA LAHORE, PAKISTAN MR. FAWAD FAROOQ CELL: 00-92-321-5558333 / INFO@ARABIANENT.COM",
        "address2": " "
    },
    {
        "code": "738",
        "address1": "THE NEXT TO EXCELLENT 81- ALI BLOCK NEW GARDEN TOWN LAHORE PAKISTAN",
        "address2": " "
    },
    {
        "code": "739",
        "address1": "KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "740",
        "address1": "ANNUM ESTATE BUILDING ROOM # 406,4th FLOOR SHAHRAH-E-FAISAL\r\nKARACHI PAKISTAN\r\nOffice: +92-21-34321721-2 (2 Lines)\r\nMobile: +92-321-2821989\r\nFax: +92-21-34321720\r\n",
        "address2": " "
    },
    {
        "code": "741",
        "address1": "S.D.21, BLOCK-B, NORTH NAZIMABAD\r\nKARACHI / PAKISTAN.",
        "address2": " "
    },
    {
        "code": "742",
        "address1": "209 REGENCY ARCADE, THEMALL FAISALABAD, PAKISTAN.",
        "address2": " "
    },
    {
        "code": "743",
        "address1": "182-SHADMAN",
        "address2": " "
    },
    {
        "code": "744",
        "address1": "16 ALLAMA IQBAL ROAD",
        "address2": "LAHORE PAKISTAN "
    },
    {
        "code": "745",
        "address1": "14-C NISHTER ROAD S.I.E SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "746",
        "address1": "P. O. BOX-2671, ST # 11, NAN & F BULD-231, MANDI SAMBRIAL, SIALKOT 51310 - PAKISTAN-SIALKOT. PH#: +92-52-3550909.",
        "address2": " "
    },
    {
        "code": "747",
        "address1": "MORGAH RAWALPINDI, PAKISTAN AND MCB BANK LTD \r\nCORPORATE THE MALL BRANCH RAWALPINDI PAKISTAN",
        "address2": " "
    },
    {
        "code": "748",
        "address1": "58-A/11, GHAIB MARKET GULBERG-111 LAHORE 54000 PAKISTAN",
        "address2": " "
    },
    {
        "code": "749",
        "address1": "SHATAB GARH",
        "address2": "SIALKOT PAKISTAN "
    },
    {
        "code": "750",
        "address1": "",
        "address2": " "
    },
    {
        "code": "751",
        "address1": "41-B LOWER MALL LAHORE-5 400 PAKISTAN TEL: 92-300-8443644",
        "address2": " "
    },
    {
        "code": "752",
        "address1": "PACIFIC HOUSE,C-17,BLOCK-2,CLIFTON,\r\nKARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "753",
        "address1": "RIAZ PURA UGUKI SIALKOT 51310 PAKISTAN",
        "address2": " "
    },
    {
        "code": "754",
        "address1": "RAWAN ROAD TATEPUR ",
        "address2": "MULTAN. PAKISTAN "
    },
    {
        "code": "755",
        "address1": "DASKA ROAD, NEAR CITY HOUSING,\r\nSIALKOT, PAKISTAN\r\n",
        "address2": " "
    },
    {
        "code": "756",
        "address1": "MAQBOOL ROAD OPP WAZIRABAD ",
        "address2": "ROAD 51310 SIALKOT "
    },
    {
        "code": "757",
        "address1": "C-45, GULSHAN-E-HADEED PHASE-II,\r\nBIN QASIM, KARACHI.",
        "address2": " "
    },
    {
        "code": "758",
        "address1": "",
        "address2": " "
    },
    {
        "code": "759",
        "address1": "ROOM NO.07 MAZANINE FLOOR MARIUM",
        "address2": "CENTRE BACHU BHAI STREET SADDAR, KARACHI -  PAKISTAN. "
    },
    {
        "code": "760",
        "address1": "PLOT NO.21 , SECTOR 30 KORANGI INUS,AREA OFF,SURGEON FAIZ KARACHI,PAKISTAN",
        "address2": " "
    },
    {
        "code": "761",
        "address1": "",
        "address2": " "
    },
    {
        "code": "762",
        "address1": "PLOT NO 262 MAIN HUB RIVER ROAD",
        "address2": "NEAR YOUSUF GOTH KARACHI PAKISTAN "
    },
    {
        "code": "763",
        "address1": "",
        "address2": " "
    },
    {
        "code": "764",
        "address1": "83-G 1ST FLOOR BLOCKS 6 PECHS ",
        "address2": "KARACHI PAKISTAN "
    },
    {
        "code": "765",
        "address1": "",
        "address2": " "
    },
    {
        "code": "766",
        "address1": "KHAN KANTA BARADARI ROAD ",
        "address2": "FARRAKHABAD SHAHDRA LAHORE PAKISTAN "
    },
    {
        "code": "767",
        "address1": "PLOT # 25/22 SECTOR NO 12C NORTH KARACHI INDUSTRIAL AREA KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "768",
        "address1": "",
        "address2": " "
    },
    {
        "code": "769",
        "address1": "C/O DET EMBARKATION\r\n603 ARMY SUPPLY COMPANY, AD CHAKLALA\r\nRAWALPINDI  46610 PK\r\nTE +923354052400",
        "address2": " "
    },
    {
        "code": "770",
        "address1": "178/1 GOSHA-I-AFIAT, SAEED COLONY FAISALABAD - PAKISTAN",
        "address2": " "
    },
    {
        "code": "771",
        "address1": "H NO 26 BLOOCK PHASE 11 MARGHAZAR COLONY LAHORE IQBAL TOWN",
        "address2": " "
    },
    {
        "code": "772",
        "address1": "CHENAB HOUSE CHAK# 204 R.B EAST",
        "address2": "CANAL ROAD FAISALABAD "
    },
    {
        "code": "773",
        "address1": "PLOT# 54-B SUNDAR INDUSTRIAL ESTATE RAIWIND ROAD, LAHORE-PAKISTAN",
        "address2": "PHONE: 042-35297476-81 "
    },
    {
        "code": "774",
        "address1": "HEADQUARTER, TERMINAL-1\r\nJINNAH INTERNATIONAL AIRPORT,\r\nKARACHI, PAKISTAN.\r\nTEL: +92-21-99242130\r\n",
        "address2": " "
    },
    {
        "code": "775",
        "address1": "SUITE NO. 713 7TH FLOOR\r\nCHAPAL PLAZA, HASRAT MOHANI ROAD",
        "address2": " "
    },
    {
        "code": "776",
        "address1": "P.O BOX 366 PLOT NO 57-59 S.I.T.E SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "777",
        "address1": "NAVAL STORE DEPOT AT PN DOCKYARD KARACHI C/O CO EHQ (N) AT NSSD WEST WHARF ROAD KARACHI",
        "address2": " "
    },
    {
        "code": "778",
        "address1": "B-39 BLOCK 13, F.B AREA\r\nKARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "779",
        "address1": "LOGISTICS\r\nSUITE # 908-9, FLOOR BUSINESS PLAZA, MUMTAZ HASSAN ROAD, OFF I.I. CHUNDIRGAR ROAD KARACHI-74000. PAKISTAN.",
        "address2": " "
    },
    {
        "code": "780",
        "address1": "PLOT NO. 21, SECTOR 23 KORANGI INDUSTRIAL AREA KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "781",
        "address1": "26-27 BLOCK (D) 2KMS RAIWIND ROAD\t\tLAHORE 53700, PAKISTAN\t\t\r\n",
        "address2": " "
    },
    {
        "code": "782",
        "address1": "B-1 STREET, SECTOR 16-A, NORTH KARACHI, KARACHI,PAKISTAN",
        "address2": " "
    },
    {
        "code": "783",
        "address1": "MADINA MADJID ROAD\r\nPACCA GARHA,\r\nSIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "784",
        "address1": "Nishat House, 53 A, Lawrence Road\r\nLahore, Pakistan\r\n",
        "address2": " "
    },
    {
        "code": "785",
        "address1": "",
        "address2": " "
    },
    {
        "code": "786",
        "address1": "PLOT SITUATED AT E-162 NORTH WESTERN INDUSTRIAL ZONE PORT QASIM",
        "address2": " "
    },
    {
        "code": "787",
        "address1": "6TH FLOOR UNI TOWER I.I.XHUNDIGAR ROAD KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "788",
        "address1": "",
        "address2": " "
    },
    {
        "code": "789",
        "address1": "PLOT NO. 8/12 A-SECTOR 12-C INDUSTRIAL AREA NORTH KARACHI",
        "address2": " "
    },
    {
        "code": "790",
        "address1": "PLOT NO. 48, SECTOR-28 KORANGI INDUSTRIAL AREA KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "791",
        "address1": "F-528/B SITE KARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "792",
        "address1": "",
        "address2": " "
    },
    {
        "code": "793",
        "address1": "PAKISTAN RAILWAYS KARACHI CANTT PAKISTAN",
        "address2": " "
    },
    {
        "code": "794",
        "address1": "MC-498 First Floor Green Town, Near Airport Karachi\r\n\r\n",
        "address2": " "
    },
    {
        "code": "795",
        "address1": "NO34 GROUND FLOOR NEW CLOTH MARKET TOWER",
        "address2": "KARACHI PAKISTAN "
    },
    {
        "code": "796",
        "address1": "Quaid-e-Azam Industrial Estate, Kot Lakhpat,\r\nLahore - 54700 Pakistan.\r\n\r\n",
        "address2": " "
    },
    {
        "code": "797",
        "address1": "KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "798",
        "address1": "C/O  AERCAP",
        "address2": " "
    },
    {
        "code": "799",
        "address1": "3-F, 3RD FLOOR, BAHRIA COMPLEX 111 LALAZAR M.T KHAN ROAD KARACHI",
        "address2": " "
    },
    {
        "code": "800",
        "address1": "LV-20-A PHASE 2 SHARJAH AE TL: 971507411086",
        "address2": " "
    },
    {
        "code": "801",
        "address1": "",
        "address2": " "
    },
    {
        "code": "802",
        "address1": "284 JAYSORWALA, THE DASKA\r\nDIST SIALKOT (51310) PAKISTAN\r\n",
        "address2": " "
    },
    {
        "code": "803",
        "address1": "726, G-11/2 IBNE-SINA ROAD\r\nISLAMABAD-PAKISTAN\r\nUNITED BANK LIMITED",
        "address2": " "
    },
    {
        "code": "804",
        "address1": "16TH FLOOR, THE HARBOR FRONT BUILDING HC#3, MARINE DRIVE, BLOCK 4, CLIFTON, KARACHI - 75600, PAKISTAN\r\n \r\n",
        "address2": " "
    },
    {
        "code": "805",
        "address1": "OFFICE #511 5th FLOOR PORT WAY TRADE  CENTRE SMCHS BLOCK A SHARE FAISAL KARACHI  PAKISTAN",
        "address2": " "
    },
    {
        "code": "806",
        "address1": "PLOT NO. 5 SECTOR CIII K.E.P.Z. KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "807",
        "address1": "E1/3 D-37 LANE STREET 6 EXT CAVALRY GROUND OUNJAB",
        "address2": " "
    },
    {
        "code": "808",
        "address1": "S-167, GROUND FLOOR, ARKAY SQUARE\r\nSHARAH-E-LIAQUAT, NEW CHALI, KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "809",
        "address1": "NO.204, NEW KUTIYANA \r\nPLAZA NEAR CHAPAL STREET\r\nKHARADAR KARACHI\r\nPAKISTAN\r\n",
        "address2": " "
    },
    {
        "code": "810",
        "address1": "19-KM SHEIKHUPURA ROAD FAISALABAD PAKISTAN",
        "address2": " "
    },
    {
        "code": "811",
        "address1": "1-KM JARRANWALA ROAD  KHURRIANWALA FAISALABAD",
        "address2": " "
    },
    {
        "code": "812",
        "address1": "CITY TOWERS 9TH FLOOR, 6-K , \r\nMAIN BOULEVARD GULBERG-III LAHORE",
        "address2": " "
    },
    {
        "code": "813",
        "address1": "4/12 ARKEY SQURE (EXTH) SHAHRA E LIAQUT KARACHI",
        "address2": " "
    },
    {
        "code": "814",
        "address1": "SHAHAB PURA ROAD SIALKOT - PAKISTAN TEL: 052-3554468",
        "address2": "CELL# 0300-8610556 "
    },
    {
        "code": "815",
        "address1": "P.O.BOX # 2287 KOTLI BHUTTA\t\t\t\t\tWAZIRABAD ROAD SIALKOT-PAKISTAN",
        "address2": " "
    },
    {
        "code": "816",
        "address1": "201,131/1, 2ND FLOOR SPEEDY TOWERS, PHASE-1, D.H.A, MAIN KORANGI ROAD, \r\nKARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "817",
        "address1": "",
        "address2": " "
    },
    {
        "code": "818",
        "address1": "",
        "address2": " "
    },
    {
        "code": "819",
        "address1": "1ST FLOOR INTERNATIONAL PLAZA BOHRA STREET MULTAN CANTT. PAKISTAN",
        "address2": " "
    },
    {
        "code": "820",
        "address1": "",
        "address2": " "
    },
    {
        "code": "821",
        "address1": "PLOT # 251/252 DEH DIN EBRAHIM HYDERI",
        "address2": " "
    },
    {
        "code": "822",
        "address1": "B - 237 MAIN IBRAHIM HAYDARY ROAD,\r\nKORANGI CREEK, KARACHI, PAKISTAN.",
        "address2": " "
    },
    {
        "code": "823",
        "address1": "259-H, BLOCK-6 P.E.C.H.S,\r\nKARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "824",
        "address1": "KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "825",
        "address1": "SUITE # 103-104, 1ST FLOOR AMBER ESTATE MAIN SHAHRAH E FAISAL KARACHI",
        "address2": " "
    },
    {
        "code": "826",
        "address1": "",
        "address2": " "
    },
    {
        "code": "827",
        "address1": "PLOT NO. B -568  SECTOR 35A, ZAMAN TOWN,",
        "address2": "KORANGI INDUSTRIAL AREA, KARACHI- PAKISTAN"
    },
    {
        "code": "828",
        "address1": "OFFICE 3/21, 3RD FLOOR, ARKAY SQUARE\r\nSHAHRAH-E-LIAQUAT, KARACHI PAKISTAN\r\n",
        "address2": " "
    },
    {
        "code": "829",
        "address1": "44,45-B KORANGI INDUSTRIAL AREA KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "830",
        "address1": "",
        "address2": " "
    },
    {
        "code": "831",
        "address1": "KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "832",
        "address1": "86-L Block-2 P.E.C.H.S,\r\nKarachi, Pakistan",
        "address2": " "
    },
    {
        "code": "833",
        "address1": "Suite # 303, 3rd Floor, Windsong Palace, \r\nP.E.C.H.S, Karachi - Pakistan\r\nTel # +92 213 4167700-01",
        "address2": " "
    },
    {
        "code": "834",
        "address1": "",
        "address2": " "
    },
    {
        "code": "835",
        "address1": "Globelink Pakistan (Pvt) Ltd. UAN      : +9221 111298298 EXT. 284 Fax        : +9221 32851678/32851981 ",
        "address2": "Cell        : + 0322-2836583 Email    : sales2@globelinkpk.com  Website : www.globelinkpk.com "
    },
    {
        "code": "836",
        "address1": "129/5-M,QUAID E AZAM INDUSTRIAL ESTATE,KOT LAKHPAT,LAHORE,PAKISTAN",
        "address2": " "
    },
    {
        "code": "837",
        "address1": "BUILDING NO: 15/320 HAJI PURA ROAD, SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "838",
        "address1": "PLOT 193, AL MADINA GARDEN EAST \r\nKARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "839",
        "address1": "PLOT NO F-787 (S.I.T.E) AREA NEAR RAFTAR GOODS BEHIND BALDIYA POLICE CHOKI ",
        "address2": "KARACHI PAKISTAN "
    },
    {
        "code": "840",
        "address1": "PLOT NO.3A LANDHI INDUSTRIAL AREA\r\nLANDHI, KARACHI, PAKISTAN.",
        "address2": " "
    },
    {
        "code": "841",
        "address1": "KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "842",
        "address1": "HOUSE NO 33/101 LINK LYTON ROAD LAHORE PAKISTAN",
        "address2": " "
    },
    {
        "code": "843",
        "address1": "",
        "address2": " "
    },
    {
        "code": "844",
        "address1": "PLOT NO. 1 TO 5 SECTOR 7-A\r\nKORANGI  INDUSTRIAL AREA,\r\nKARACHI - PAKISTAN.",
        "address2": " "
    },
    {
        "code": "845",
        "address1": "PLOT NO. 1 TO 5 SECTOR 7-A\r\nKORANGI  INDUSTRIAL AREA,\r\nKARACHI - PAKISTAN.",
        "address2": " "
    },
    {
        "code": "846",
        "address1": "DA3 POTATO ONION SECTION NEW VEGETABLE MARKET SUPER HIGHWAY KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "847",
        "address1": "",
        "address2": " "
    },
    {
        "code": "848",
        "address1": "G28-29, CH. KHALIQUZAMAN ROAD\r\nCLIFTON BL.8, KARACHI , PAKISTAN",
        "address2": " "
    },
    {
        "code": "849",
        "address1": "HANZ TILES & CERAMICS\r\nSUITE 4,99-CF-1/5,CLIFTON,KARACHI-75600 PAKISTAN",
        "address2": " "
    },
    {
        "code": "850",
        "address1": "MARALA ROAD MURAD PUR SIALKOT 51360 PAKISTAN",
        "address2": " "
    },
    {
        "code": "851",
        "address1": "",
        "address2": " "
    },
    {
        "code": "852",
        "address1": "L61-62 SEC 16B GABOL TOWN NORTH KARACHI INDUSTRIAL AREA",
        "address2": "KARACHI PAKISTAN "
    },
    {
        "code": "853",
        "address1": "H/NO 1/122 STREET ARAIYAN MUBARAK PURA SIALKOT",
        "address2": " "
    },
    {
        "code": "854",
        "address1": "HOUSE NO 33/101 LINL LYTON ROAD LAHORE PUNJAB 54000",
        "address2": " "
    },
    {
        "code": "855",
        "address1": "OFFICE NO: F-150, ODEON CENTER ,\r\nPLOT NO: 310/2, PREEDY STREET ,\r\nREGAL CHOK ,SADDAR KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "856",
        "address1": "KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "857",
        "address1": "",
        "address2": " "
    },
    {
        "code": "858",
        "address1": "1-WALI CENTER SB 6 BLOCK 13/C GULSHAN-E-IQBAL KARACHI, PAKISTAN.",
        "address2": " "
    },
    {
        "code": "859",
        "address1": "HOUSE NO 15 STREET NO 33 ZAKARIYA TOWN BOSAN ROAD MULTAN PAKISTAN",
        "address2": " "
    },
    {
        "code": "860",
        "address1": "HOUSE NO 5 STREET NO 5AQAB MISSION HOSPITAL MOH PORAN NAGAR PARIS ROAD SILAKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "861",
        "address1": "",
        "address2": " "
    },
    {
        "code": "862",
        "address1": "KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "863",
        "address1": "",
        "address2": " "
    },
    {
        "code": "864",
        "address1": "68, 2nd FLOOR COCHINWALA \r\nMARKET TOWER KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "865",
        "address1": "KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "866",
        "address1": "PLOT NO 31 E PORT QASIM NORTH WEST INDUS ZONE 74000",
        "address2": "KARACHI PAKISTAN "
    },
    {
        "code": "867",
        "address1": "NEAR CIVIL HOSPITAL STADIUM ROAD",
        "address2": "DASKA SIALKOT PAKISTAN "
    },
    {
        "code": "868",
        "address1": "",
        "address2": " "
    },
    {
        "code": "869",
        "address1": "EXPORT PROCESSING ZONE\r\nPLOT #3, SECTOR B-VIII, P.O. BOX 18681, LANDHI -KARACHI,PAKISTAN",
        "address2": " "
    },
    {
        "code": "870",
        "address1": "",
        "address2": " "
    },
    {
        "code": "871",
        "address1": "LAHORE - PAKISTAN",
        "address2": " "
    },
    {
        "code": "872",
        "address1": "G-50 RIMPA PLAZA M.A JINNAH ROAD",
        "address2": "KARACHI "
    },
    {
        "code": "873",
        "address1": "G-RIMPA PLAZA M. A. JINNAH ROAD,\r\nKARACHI, PAKISTAN.",
        "address2": " "
    },
    {
        "code": "874",
        "address1": "KARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "875",
        "address1": "C/O MRS IRAJ MUNIR, 1107-225\r\nWEBB DRIVE. MISSISSAUGA, ONTARIO\r\nL5B4P2 POSTAL CODE CANADA\r\n\r\n",
        "address2": " "
    },
    {
        "code": "876",
        "address1": "D-27, BLOCK-9, CLIFTON CH. KHALIQ-UZ-ZAMAN RAOD, KARACHI, PC 75600.",
        "address2": " "
    },
    {
        "code": "877",
        "address1": "P-177, 1ST FLOOR, COLLEGE ROAD, \r\nSAMANABAD, FAISALABAD \r\nIQBAL TOWN-PAKISTAN",
        "address2": " "
    },
    {
        "code": "878",
        "address1": "42-C26 TH street Tauheed commercial Area, Phase 5 D.H.A. Karachi , Pakistan NTN: 7791587-8\r\n",
        "address2": " "
    },
    {
        "code": "879",
        "address1": "PLOT NO.11/4 SECTOR 17 KORANGI INDUSTRIAL AREA KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "880",
        "address1": "EXPORT PROCESSING ZONE, PLOT # 03 SECTOR B VIII, P.O BOX 18681 LANDHI KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "881",
        "address1": "CITI TOWER,33-A BLOCK-6,P.E.C.H.S.\r\nSHAHRAH-E-FAISAL,KARACHI,PAKISTAN",
        "address2": " "
    },
    {
        "code": "882",
        "address1": "MILLAT TOWN PAHARANG DRAINAGE",
        "address2": "MILLAT ROAD FAISALABAD "
    },
    {
        "code": "883",
        "address1": "P-79 SHIEKHUPURA ROAD,\r\nFAISALABAD, PAKISTAN",
        "address2": " "
    },
    {
        "code": "884",
        "address1": "JAHANZAIB MISBAH,A-110 BLOCK 15\r\nGULISTAN-E-JOHAR KARACHI,PAKISTAN",
        "address2": " "
    },
    {
        "code": "885",
        "address1": "114, NEAR CLOCK TOWER SADDAR BAZAR\r\nSIALKOT-51310 PAKISTAN.",
        "address2": " "
    },
    {
        "code": "886",
        "address1": "NIZAM ABAD PINDI, ARYANA,\r\nBHATTA MUHAMMAD SHAFI,\r\nSIALKOT PAKISTAN\r\n",
        "address2": " "
    },
    {
        "code": "887",
        "address1": "108 SHADMAN-1 LAHORE, PAKISTAN\r\nPH: +92 42 37669588",
        "address2": " "
    },
    {
        "code": "888",
        "address1": "2ND FLOOR BLOCK 6 PECHS",
        "address2": " "
    },
    {
        "code": "889",
        "address1": "",
        "address2": " "
    },
    {
        "code": "890",
        "address1": "1ST FLOOR, AL-FALAH CHAMBER,\r\nABDULLAH HAROON ROAD, KARACHI",
        "address2": " "
    },
    {
        "code": "891",
        "address1": "KE HOUSE 39/B SUNSET BOULEVARD PHASE 2 D.H.A KARACHI",
        "address2": " "
    },
    {
        "code": "892",
        "address1": "18-19, 1ST FLOOR YARN CENTER\r\nMONTGOMERY BAZAR, FAISALABAD",
        "address2": " "
    },
    {
        "code": "893",
        "address1": "19KM - SHEIKHUPURA ROAD\r\nFAISALABAD, PAKISTAN\r\n",
        "address2": " "
    },
    {
        "code": "894",
        "address1": "",
        "address2": " "
    },
    {
        "code": "895",
        "address1": "",
        "address2": " "
    },
    {
        "code": "896",
        "address1": "KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "897",
        "address1": "H NO 09 SECTOR 8-A/1 HABIB SOCIETY CO H S 33 KARACHI",
        "address2": " "
    },
    {
        "code": "898",
        "address1": "41 A, INDUSTRIAL ESTATE\r\nSIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "899",
        "address1": "Fabeha Castle, 168 Block B, S.M.C.H.S\r\nKarachi, Pakistan",
        "address2": " "
    },
    {
        "code": "900",
        "address1": "AAMIR TRADE CENTER, SUITE 5, 4TH FLOOR 233/1-A BLOCK 2, P.E.C.H SOCIETY, KARACHI /PAKISTAN",
        "address2": " "
    },
    {
        "code": "901",
        "address1": "OFF NO. 3, 2ND FLOOR PLAZA NO 16,\r\nARSHAD SHARIF PLAZA, G-11 MARKAZ\r\nISLAMABAD , PAKISTAN",
        "address2": " "
    },
    {
        "code": "902",
        "address1": "6 Church Street Fateh Garh Sialkot",
        "address2": "Pakistan "
    },
    {
        "code": "903",
        "address1": "37-P, GULBERG, 11, LAHORE PAKISTAN",
        "address2": " "
    },
    {
        "code": "904",
        "address1": "25 WEST WHARF INDUSTRIAL AREA ",
        "address2": "KARACHI - PAKISTAN "
    },
    {
        "code": "905",
        "address1": "HN 24 256 A MOHALLAH DHAROWALL SILAKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "906",
        "address1": "",
        "address2": " "
    },
    {
        "code": "907",
        "address1": "10 KM DHEERA SANDHA PASRUR ROAD SIALKOT 51310 PAKISTAN",
        "address2": " "
    },
    {
        "code": "908",
        "address1": "A-51/A, SITE, MAGHOPIR ROAD, KARACHI",
        "address2": " POC"
    },
    {
        "code": "909",
        "address1": "OFFICE NO 709 7TH KAWISH CROWN PLAZA D.A.C.H.S BLOCK 7/8 SHAHRAH E FAISAL KARACHI",
        "address2": " "
    },
    {
        "code": "910",
        "address1": "A-109 1ST FLOOR BHAYANI SHOPPING CENTRE BLOCK-N NORTH NAZIMABAD KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "911",
        "address1": "PO BOX 432 WAZIRABAD ROAD",
        "address2": "SIALKOT PAKISTAN "
    },
    {
        "code": "912",
        "address1": "F / 418 S.I.T.E. KARACHI PAKISTAN",
        "address2": "TEL # +92 (021) 2579361 UPTO 2 &  021-2576506. FAX # +92 (021) 2575979 "
    },
    {
        "code": "913",
        "address1": "88-92 SMALL INDUSTIES ESTATE M.A JINNAH ROAD SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "914",
        "address1": "R. T. SAWANT ROAD, OFF NISHTER ROAD,\r\nKARACHI.74400 PAKISTAN.",
        "address2": " "
    },
    {
        "code": "915",
        "address1": "MAQBOOL ROAD OPT, WAZIRABAD ROAD\t\t\t\tSIALKOT- PAKISTAN\t\t\t\t\r\n",
        "address2": " "
    },
    {
        "code": "916",
        "address1": "PLOT NO. C.I.DD-2, SECTOR 16,\r\nK.I.A. KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "917",
        "address1": "",
        "address2": " "
    },
    {
        "code": "918",
        "address1": "P.O BOX 759 SIALKOT 51310 PAKISTAN TEL: 92-52-3554552 & 3256256",
        "address2": " "
    },
    {
        "code": "919",
        "address1": "59, SECTOR 7-A, KORANGI INDUSTRIAL AREA, KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "920",
        "address1": "PLOT NO 32 S.I.E NEAR GRID STATION UGOKI ROAD SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "921",
        "address1": "",
        "address2": " "
    },
    {
        "code": "922",
        "address1": "KARACHI - PAKITAN",
        "address2": " "
    },
    {
        "code": "923",
        "address1": "NOWL MORH RORAS ROAD  SIALKOT - PAKISTAN",
        "address2": " "
    },
    {
        "code": "924",
        "address1": "ABBA SOOMAR STREET GHARI KHATA LIGHT HOUSE M A JINNAH ROAD",
        "address2": " "
    },
    {
        "code": "925",
        "address1": "HOUSE NO-1195, NASIR COLONY, \r\nSECTOR NO.32/D KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "926",
        "address1": "OFFICE 181/21, A.M OFF SHAHRAH-E-LIAQUAT, NEAR PASSPORT OFFICE SADDAR KARACHI.TEL#: +92-21-36367786.",
        "address2": " "
    },
    {
        "code": "927",
        "address1": "82-C/1, GULLBERG-III, LAHORE-PAKISTAN.",
        "address2": " "
    },
    {
        "code": "928",
        "address1": "LAHORE PAKISTAN",
        "address2": " "
    },
    {
        "code": "929",
        "address1": "",
        "address2": " "
    },
    {
        "code": "930",
        "address1": "Suite # 9/1, 9th Floor, Arkay Square,\nMain Shahrah-e-Liaquat, Karachi - Pakistan.\nTel: +92-213- 242 1426 - 27 (02 Lines)\nFax: +92-213- 242 1428\nCell: +92-345- 220 6966\nE-Mail: noshan@maxpeedshipping.com",
        "address2": "Skype: noshanarbi Web: www.maxpeedshipping.com  "
    },
    {
        "code": "931",
        "address1": "MAYO COMPLEX LAHORE PAKISTAN PUNJAB  54600 PK",
        "address2": " "
    },
    {
        "code": "932",
        "address1": "P. O. Box 600, KHADIM ALI ROAD,   \r\nSIALKOT - 51310, PAKISTAN\r\n\r\n",
        "address2": " "
    },
    {
        "code": "933",
        "address1": "",
        "address2": " "
    },
    {
        "code": "934",
        "address1": "",
        "address2": " "
    },
    {
        "code": "935",
        "address1": "76 CC SECTOR D BAHRIA TOWN LAHORE 5400 PAKISTAN",
        "address2": " "
    },
    {
        "code": "936",
        "address1": "104/C GHALIB ROAD S.I.E SIALKOT 51310 PAKISTAN",
        "address2": " "
    },
    {
        "code": "937",
        "address1": "FATEH GHAR SMALL INDUSTRIES ESTATE SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "938",
        "address1": "",
        "address2": " "
    },
    {
        "code": "939",
        "address1": "New Office Address: S/3, S.I.T.E, G ALLANA ROAD, KARACHI-28",
        "address2": " "
    },
    {
        "code": "940",
        "address1": "HOUSE NO A-317, SECROT 11-B\r\nNORTH KARACHI PAKISTAN\r\n",
        "address2": " "
    },
    {
        "code": "941",
        "address1": "AT-3, A BLOCK MIDCITY, SERVICE ROAD ISLAMABAD",
        "address2": " "
    },
    {
        "code": "942",
        "address1": "",
        "address2": " "
    },
    {
        "code": "943",
        "address1": "\r\nHOUSE NO C 78, BLOCK 6 GULSHAN-E-IQBAL\r\nKARACHI- SINDH PAKISTAN\r\n",
        "address2": " "
    },
    {
        "code": "944",
        "address1": "KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "945",
        "address1": "NO 10 SANDS APPARTMENT BLOCK 2 NEAR CHINA TOWN CLIFTON",
        "address2": "KARACHI PAKISTAN "
    },
    {
        "code": "946",
        "address1": "HOUSE # C-33 SECTOR 14/A SHADMAN TOWN ",
        "address2": "KARACHI PAKISTAN "
    },
    {
        "code": "947",
        "address1": "120-MUQADDAS PARK GULSHAN E RAVI LAHORE, PAKISTAN",
        "address2": " "
    },
    {
        "code": "948",
        "address1": "",
        "address2": " "
    },
    {
        "code": "949",
        "address1": "ROOM 207 208 AMBER PRIDE MAIN NURSERY SHAHRAH E FAISAL KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "950",
        "address1": "2ND FLOOR SAFA HOUSE ABDULLAH HAROON ROAD, KARACHI, PAKISTAN 74400",
        "address2": " "
    },
    {
        "code": "951",
        "address1": "R-104 ANUM HOMES JAMIA MILLIA ROAD ",
        "address2": "KARACHI - PAKISTAN. "
    },
    {
        "code": "952",
        "address1": "ROOM NO. 204 WINDSONG PLACE\r\nPLOT NO. A 16-17, BLOCK NO. 7 & 8,\r\nK.C.H. SOCIETY, KARACHI",
        "address2": " "
    },
    {
        "code": "953",
        "address1": "KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "954",
        "address1": "OFFICE NO 01 PLOT NO C-931 BLOCK-2 PECHS TARIQ ROAD KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "955",
        "address1": "SHAHAB PURA ROAD SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "956",
        "address1": "",
        "address2": " "
    },
    {
        "code": "957",
        "address1": "Royal Consulate General of Saudi Arabia\r\n20-22 Khayaban-e-Hafiz, Phase V Defence Housing Authority,  Karachi, Sindh 75500, Pakistan\r\n\r\n",
        "address2": " "
    },
    {
        "code": "958",
        "address1": "Shop # 10 Shakoor, Market B 36 Block - 1 \r\nShireen Jinnah Colony Clifton, Karachi South \r\n",
        "address2": " "
    },
    {
        "code": "959",
        "address1": "507-510 COMMERCE CENTRE HASRAT MOHANI ROAD KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "960",
        "address1": "23/8 NUSRULLAH TOWN  SAEED COLONY  NO 2  , FAISALABAD-PAKISTAN.",
        "address2": " "
    },
    {
        "code": "961",
        "address1": "PLOT NO. 11-A, SECTOR 8 F KORANGI INDUSTRIAL AREA KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "962",
        "address1": "Address: Office B-3, 2nd Floor, Haryani Tower, Plot 23-C, 27th Street, Tauheed Commercial, DHA Phase 5-Ext, Karachi, Pakistan",
        "address2": " "
    },
    {
        "code": "963",
        "address1": "",
        "address2": " "
    },
    {
        "code": "964",
        "address1": "898-BAGHBAN PURA, STREET NO. 40/S DEHLI GATE MULTAN PAKISTAN",
        "address2": " "
    },
    {
        "code": "965",
        "address1": "KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "966",
        "address1": "",
        "address2": " "
    },
    {
        "code": "967",
        "address1": "PLOT # F-306 2ND FLOOR S.I.T.E KARACHI",
        "address2": " "
    },
    {
        "code": "968",
        "address1": "PLOT.NO.687 STREET 13 BLOCK 1 GULSHAN.E.IQBAL KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "969",
        "address1": "1ST FLOOR PLOT NO 551 SECTOR 7/A KORANGI INDUSTRIAL AREA",
        "address2": "KARACHI 74900 PAKISTAN "
    },
    {
        "code": "970",
        "address1": "4TH FLOOR, 83-C PHASE II EXTENSION MAIN NATIONAL HIGHWAY DHA KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "971",
        "address1": "PLOT # 81, SECTOR 7A, KORANGI INDUSTRIAL AREA,\r\nKARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "972",
        "address1": "",
        "address2": " "
    },
    {
        "code": "973",
        "address1": "J-30, SHEET NO: 15 MODEL COLONY KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "974",
        "address1": "",
        "address2": " "
    },
    {
        "code": "975",
        "address1": "RAM GARH ROAD DUBURJI MATHAYAN SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "976",
        "address1": "",
        "address2": " "
    },
    {
        "code": "977",
        "address1": "904-POGRESSIVE SQUARE 11-A, BLOCK-6\r\nPECHS KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "978",
        "address1": "",
        "address2": " "
    },
    {
        "code": "979",
        "address1": "1/6-A FLOOR, BLOCK-6 PECHS \r\nKARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "980",
        "address1": "E-491/1, HERDIL RAAM STREET GARDEN EAST KARACHI-PAKISAN",
        "address2": " "
    },
    {
        "code": "981",
        "address1": "TARMAC AREA, ADJACENT TERMINAL -2, \r\nJINNAH INT'L AIRPORT KARACHI",
        "address2": " "
    },
    {
        "code": "982",
        "address1": "F/18-20, BILAL CENTRE \r\nNICHOLSON ROAD\r\nLAHORE",
        "address2": " "
    },
    {
        "code": "983",
        "address1": "PLOT# 1166, SEC 9/A,BALDIA TOWN ,SB.\r\nKARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "984",
        "address1": "PLOT C/21 AL HABIB SOCIETY",
        "address2": " "
    },
    {
        "code": "985",
        "address1": "PLOT NO C/21 AL HABIB SOCIETY GULSHAN E MAYMAR KARACHI",
        "address2": " "
    },
    {
        "code": "986",
        "address1": "SAIMA HOUSE 688, ST 13-BLOCK GULSHAN-E-IQBAL",
        "address2": " "
    },
    {
        "code": "987",
        "address1": "208 2ND FLOOR SAJJAD CENTER H-3 JOHAR",
        "address2": "TOWN LAHORE-54000 PAKISTAN "
    },
    {
        "code": "988",
        "address1": "NO 101 ALC PAF - FAISAL KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "989",
        "address1": "PROCUREMENT AND LOGISTICS\r\nPROCUREMENT AND LOGISTICS DEPTT, \r\nP.I.A HEAD OFFICE, \r\nKARACHI PAKISTAN\r\nTEL : 99043568\r\n",
        "address2": " "
    },
    {
        "code": "990",
        "address1": "S/3 G.ALLANA ROAD S.I.T.E KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "991",
        "address1": "17-F BLOCK-6 P.E.C.H.S KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "992",
        "address1": "407/14 SHAHABUDDIN GHORI COLONY GARDEN WEST LASBELLA NISHTER ROAD",
        "address2": "KARACHI.74550 PAKISTAN "
    },
    {
        "code": "993",
        "address1": "PLOT NO.321, SECTOR 7-A, KORANGI INDUSTRIAL AREA, KARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "994",
        "address1": "",
        "address2": " "
    },
    {
        "code": "995",
        "address1": "",
        "address2": " "
    },
    {
        "code": "996",
        "address1": "NIZAM ABAD ZAFARWAL ROAD SIALKOT 51310 PAKISTAN",
        "address2": " "
    },
    {
        "code": "997",
        "address1": "27 BADRI BUILDING, I.I. CHUNDRIGAR ROAD,\r\nKARACHI, PAKISTAN.\r\nNTN NUMBER 0674783-3\r\n",
        "address2": " "
    },
    {
        "code": "998",
        "address1": "ON BEHALF OF RUTEX GMBH 1ST FLOOR HAJI ADAM",
        "address2": "CHAMBER ALTAF HUSSAIN ROAD NEW CHALLI KARACHI PAKISTAN "
    },
    {
        "code": "999",
        "address1": "C-40/41 SITE SUPERHIGHWAY INDUS AREA SCHEME 33 KARACHI 74200 PK",
        "address2": " "
    },
    {
        "code": "1000",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1001",
        "address1": "2/1 SECTOR 15, KORANGI INDUSTRIAL AREA KARACHI - PAKISTAN.",
        "address2": " "
    },
    {
        "code": "1002",
        "address1": "1ST FLOOR 7-C-1 GULBERG LAHORE PK",
        "address2": " "
    },
    {
        "code": "1003",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1004",
        "address1": "4/90, SECTOR 21, K.I.A\r\nKARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "1005",
        "address1": "WS-7, MADINA PALACE, F.C.H.S, DHORAJI COLONY, KARACHI- PAKISTAN \r\nREX REGISTRATION NUMBER: PKREXPK08627886 \r\n",
        "address2": " "
    },
    {
        "code": "1006",
        "address1": "SHOP NO, 13 BLOCK-2 NEW FRUIT MARKET SUPER HIGHWAY KARACHI PAKISTAN\r\n03028283192",
        "address2": " "
    },
    {
        "code": "1007",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1008",
        "address1": "# 31 GROUND FLOOR BUSINESS PLAZA MUMTAZ HASSAN ROAD",
        "address2": " "
    },
    {
        "code": "1009",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1010",
        "address1": "KA 4 - C 2/1 BOCK 22 F.B INDUSTRIAL AREA KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "1011",
        "address1": "NC-91,DEHKHANTO LANDHI\r\nKARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "1012",
        "address1": "5-C, 5/17 NAZIMABAD., P.O. BOX#: 2513.\r\nKARACHI-PAKISTAN.",
        "address2": " "
    },
    {
        "code": "1013",
        "address1": "NAI ABADI RUNG PURA MUHALLA TARIQ PURA SIALKOT 51310 PAKISTAN",
        "address2": " "
    },
    {
        "code": "1014",
        "address1": "Plot No. 124-K, Block-2, P.E.C.H.S., Tariq Road, Karachi, Pakistan.\r\nPh: +92-21-34381447 email: rstariqroad@yahoo.com\r\n",
        "address2": " "
    },
    {
        "code": "1015",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1016",
        "address1": "ABBOT ROAD SIALKOT 51310,PAKISTAN",
        "address2": " "
    },
    {
        "code": "1017",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1018",
        "address1": "PLOT NO. 91 SECTOR-24 KORANGI INDUSTRIAL AREA KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "1019",
        "address1": "B-51, RIZWAN SOCIETY, MAIN UNIVERSITY ROAD, KARACHI-PAKISTAN.",
        "address2": " "
    },
    {
        "code": "1020",
        "address1": "Mohalla Bejle Ghar 16/324,\r\nNear Small Industrial Estate\r\n51310 Sialkot-Pakistan.\r\n",
        "address2": " "
    },
    {
        "code": "1021",
        "address1": "195-B, BLOCK-3, ADMINISTRATIVE SOCIETY, KARACHI",
        "address2": " "
    },
    {
        "code": "1022",
        "address1": "D-11 SOUTH AVENUE S.I.T.E",
        "address2": "KARACHI PAKISTAN "
    },
    {
        "code": "1023",
        "address1": "PLOT NO 3, SOMMAR CHATTA GOTH OP P PREM VILLAS MALIR CANNT KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "1024",
        "address1": "BUILDING NO1 L/32/A BLOCK 22 F.B.AREA ",
        "address2": "KARACHI-PAKISTAN "
    },
    {
        "code": "1025",
        "address1": "SUITE 909 9TH FLOOR  Q M HOUSE ELANDER ROAD OPP. SHAHEEN COMPLEX ",
        "address2": "KARACHI PAKISTAN "
    },
    {
        "code": "1026",
        "address1": "7KM Daska Road 51310\r\nSialkot, Pakistan\r\n",
        "address2": " "
    },
    {
        "code": "1027",
        "address1": "DEFENCE ROAD,HADI TOWN,SIALKOT\r\n51030 – PAKISTAN.",
        "address2": " "
    },
    {
        "code": "1028",
        "address1": "SAHIANWALA ROAD, KHURRIANWALA, \r\nFAISALABAD PAKISTAN",
        "address2": " "
    },
    {
        "code": "1029",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1030",
        "address1": "05TH FLOOR, ADAMJEE HOUSE, \r\nI. I. CHUNDRIGAR ROAD,\r\nKARACHI 74000, PAKISTAN",
        "address2": " "
    },
    {
        "code": "1031",
        "address1": "SUITE # 1013, 10 FLOOR , CHAPAL PLAZA KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "1032",
        "address1": "4-KM BAHAWALPUR NEAR YAQOOB SOAP,FACTORY NASIRABAD MULTAN NTN #: 6328193-5",
        "address2": " "
    },
    {
        "code": "1033",
        "address1": "OLD SABZI MANDI NO. 2 UNIVERSITY ROAD",
        "address2": "KARACHI-PAKISTAN "
    },
    {
        "code": "1034",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1035",
        "address1": "MULLA KAMAL, GOUSHALLA SIALKOT-PAKISTAN",
        "address2": " "
    },
    {
        "code": "1036",
        "address1": "10-C STADIUM LANE 1, OFF KHAYABAN-E-SHAMSHEER, PHASE V, D.H.A. KARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "1037",
        "address1": "F-95,OFF HUB RIVER ROAD,\r\nS.I.T.E.KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "1038",
        "address1": "PLOT # E2 OFFICE # 101 102 FIRST FLOOR SITE AVENUE ROAD DHEDHI BUSINESS AVENUE KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "1039",
        "address1": "3.5 KM, RAIWIND MANGA ROAD, RAIWIND DISTT, KASUR, PAKISTAN",
        "address2": " "
    },
    {
        "code": "1040",
        "address1": "21-WARIS ROAD,\r\nLAHORE-54000 PAKISTAN.",
        "address2": " "
    },
    {
        "code": "1041",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1042",
        "address1": "KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "1043",
        "address1": "ROOM. NO.613, TRADE TOWER ABDULLAH \r\nHAROON ROAD KARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "1044",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1045",
        "address1": "E-17, S.I.T.E., KARACHI \r\nPAKISTAN",
        "address2": " "
    },
    {
        "code": "1046",
        "address1": "LABORATORIES KALALWAL 20KM LAHORE JARANWALA ROAD",
        "address2": "DISTRICT SHEIKHUPURA SIN PAKISTAN "
    },
    {
        "code": "1047",
        "address1": "AIR FREIGHT DIVISION ROOM # 509 5TH FLOO ANUM EMPIRE BLOCK # ZCCI K.E.C.H.S, KARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "1048",
        "address1": "Office No. 3 Lower Floor, Paris Arcade,E-11/3 Markaz MPCHS, Islamabad, Pakistan",
        "address2": " "
    },
    {
        "code": "1049",
        "address1": "BURNEY HOUSE, 1/6M, BLOCK-6, P.E.C.H.S,  SHAHRAH-E-FAISAL, MAIN NURSERY.",
        "address2": " "
    },
    {
        "code": "1050",
        "address1": "TERMINAL-1 OPPOSITE AFU JINNAH INTERNATIONAL AIRPORT",
        "address2": "KARACHI . PK "
    },
    {
        "code": "1051",
        "address1": "SERVIS HOUSE 2-MAIN GULBERG,\r\nLAHORE 54662 PAKISTAN",
        "address2": " "
    },
    {
        "code": "1052",
        "address1": "Servopak Shipping Agency\r\nRoom # 208, 2nd Floor,\r\nAnum Empire, Shahrah-e-Faisal,\r\nKarachi, Pakistan\r\nPhone:  0092 213 4381063-4\r\nCell # 92 345 278 4488\r\nFax: :      0092 213 4398295\r\n",
        "address2": " "
    },
    {
        "code": "1053",
        "address1": "SUITE # 208 CHAPAL PLAZA HASRAT MOHANI ROAD ",
        "address2": "KARACHI-PAKISTAN "
    },
    {
        "code": "1054",
        "address1": "AL AKBER STREET JUNA MARKET KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "1055",
        "address1": "RORAS ROAD MUZAFAAR PUR. SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "1056",
        "address1": "ROOM NO 14D 2ND FLOOR WRITTER CHAMBER MUMTAZ HASSAN ROAD KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "1057",
        "address1": "PLOT NO. 27 STREET NO W 06 ADAMJI BUDHA BHOY ROAD WADHUMAL ODAHARAM QUARTERS LIGHT HOUSE KARACHI",
        "address2": " "
    },
    {
        "code": "1058",
        "address1": "HOUSE # A-109 STREET NO 4 BLOCK M MUKHDOOM SHAH COLONY SEC 11 1/2 ORNAGI TOWN KARACHI",
        "address2": " "
    },
    {
        "code": "1059",
        "address1": "JINNAH INTERNATIONAL AIRPORT, KARACHI-75200, PAKITAN",
        "address2": " "
    },
    {
        "code": "1060",
        "address1": "TERMINAL ROAD, JINNAH INT'L AIRPORT\r\nKARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "1061",
        "address1": "PLOT NO C/11. SECTOR, 8/4 AL HABIB CO OPERATIVE HOUSING SOCIETY",
        "address2": " "
    },
    {
        "code": "1062",
        "address1": "UNIT # 5,6,7,12,13 & 14, SECTOR A-VII\r\nKARACHI EXPORT PROCESSING ZONE,\r\nKARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "1063",
        "address1": "S.I.E UGOKI ROAD NEAR GRID STATION SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "1064",
        "address1": "293/16, BLOCK - 3, B.Y.J.C.H.S.,\r\nBAHADURABAD, KARACHI, PAKISTAN\r\nTEL: (9221)-4855654-6, FAX: 4855657",
        "address2": " "
    },
    {
        "code": "1065",
        "address1": "F-17 MARIPUR ROAD S.I.T.E KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "1066",
        "address1": "SUITE 406 4TH FLOOR INDUSTRIAL TOWN PLAZA OPP SINDH MADRESA SHARAH E LIAQUAT NEW CHALI KARACHI",
        "address2": " "
    },
    {
        "code": "1067",
        "address1": "CD 388 & 389 GABOL TOWN, SECTOR 16-B, F.B.AREA, KARACHI, PAKISTAN.",
        "address2": " "
    },
    {
        "code": "1068",
        "address1": "P.O BOX 442, SARGODHA ROAD, FAISALBAD, PAKISTAN",
        "address2": " "
    },
    {
        "code": "1069",
        "address1": "MASKAN PLAZA GULSHAN 'E' IQBAL  KARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "1070",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1071",
        "address1": "PLOT NO E-20 E-36 E-37 AND E-38   H.I.T.E.LASBELA HUB 90250 BALUCHISTAN- PAKISTAN",
        "address2": " "
    },
    {
        "code": "1072",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1073",
        "address1": "TAZKAR PLAZA DALZAK ROAD KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "1074",
        "address1": "SIALKOT",
        "address2": " "
    },
    {
        "code": "1075",
        "address1": "SUIT NO 317 3RD FLOORGRAIN CENTRE OPP CITY COURT KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "1076",
        "address1": "KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "1077",
        "address1": "P.O. BOX NO. 1123,\r\n94 AZIZ SHAHEED ROAD,\r\nSIALKOT 51310, PAKISTAN",
        "address2": " "
    },
    {
        "code": "1078",
        "address1": "PLOT # A-108, IBNEISHAH ROAD ROOAIDAD NAGAR NAZIMABAD 5/B, KARACHI",
        "address2": " "
    },
    {
        "code": "1079",
        "address1": "M.A JINNNAH ROAD, SHOP 28-29 YUSAF MARKET, KARACHI, PAKISTAN.",
        "address2": " "
    },
    {
        "code": "1080",
        "address1": "SSGC HOUSE SIR SHAH SULEMAN ROAD GULSHAN-E-IQBAL P O BOX 17989",
        "address2": "KARACHI-75300 PAKISTAN "
    },
    {
        "code": "1081",
        "address1": "Office#709, 7TH Floor, Anum Empire \r\nShahra-e-Faisal Karachi 75350 Pakistan \r\n",
        "address2": " "
    },
    {
        "code": "1082",
        "address1": "MC 1114 GREEN TOWN SHAH FAISAL COLONY KARACHI,",
        "address2": " "
    },
    {
        "code": "1083",
        "address1": "H NO B-16 RASHDI GOTH BLK-9 GULISTAN-E-JOHAR KARCHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "1084",
        "address1": "R-9/B SONY RESORTS SECTOR 40 SCHEME 33 GULISTAN-E-JOHAR KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "1085",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1086",
        "address1": "CAPITAL ROAD CHEEMA STREET, MODEL TOWN, SIALKOT 51310",
        "address2": " "
    },
    {
        "code": "1087",
        "address1": "KDLB BUILDING 2ND FLOOR ",
        "address2": "KARACHI PAKISTAN +92-21 32315962-63-64 "
    },
    {
        "code": "1088",
        "address1": "A/159, S.I.T.E SUPER HIGHWAY\r\nKARACHI PAKISTAN\r\n\r\n",
        "address2": " "
    },
    {
        "code": "1089",
        "address1": "Plot#b-48-49-67-68 MARBLE CITY HUB KARACHI",
        "address2": " "
    },
    {
        "code": "1090",
        "address1": "PASRUR ROAD SIALKOT - PAKISTAN.",
        "address2": " "
    },
    {
        "code": "1091",
        "address1": "48. PAPER MARKET H.A.A AFANDI ROAD  KARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "1092",
        "address1": "115, 1st FLOOE, SABAH PALACE , SHAHREH-E-FAISAL,\r\nKARACHI PAKISTAN\r\nPhone + 92.21.34326801-3  EXT:108\r\nDirect  + 92.21.34322247 \r\nFax     + 92.21.34322249\r\nCell     + 92.322.2277386\r\nEmail   ahmed@tea",
        "address2": "m-freight.com "
    },
    {
        "code": "1093",
        "address1": "316 UPPER MALL LAHORE 54000 PAKISTAN ",
        "address2": " "
    },
    {
        "code": "1094",
        "address1": "A-17/C, NEAR SITE STADIUM, S.I.T.E \r\nKARACHI - PAKISTAN\r\n",
        "address2": " "
    },
    {
        "code": "1095",
        "address1": "A-17/C NEAR SITE STADIUM SITE KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "1096",
        "address1": "PLOT NO. DP-90/A, SECTOR 12-C\r\nNORTH KARACHI INDUSTRIAL AREA \r\nKARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "1097",
        "address1": "PLOT NO.CI-124 & 125\r\nSECTOR 12/C, NORTH KARACHI\r\nKARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "1098",
        "address1": "8TH FLOOR, SIDCO COMMERCIAL AVENUE R.A. LINES, STRECHEN ROAD KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "1099",
        "address1": "PLOT C-76, SECTOR 31/5\r\nKORANGI CROSSING KARACHI  75190\r\nPakistan",
        "address2": " "
    },
    {
        "code": "1100",
        "address1": "PLOT NO. 94 SECTOR 7-A KORANGI INDUSTRIAL AREA ",
        "address2": "KARACHI PAKISTAN "
    },
    {
        "code": "1101",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1102",
        "address1": "M-1 PLOT 3C STADIUM LANE 2",
        "address2": "PHASE 5 DHA 75500 KARACHI PAKISTAN "
    },
    {
        "code": "1103",
        "address1": "UNIVERSITY OF AGRICULTURE",
        "address2": "JAIL ROAD FAISALABAD PAKISTAN "
    },
    {
        "code": "1104",
        "address1": "C-3 DATA CENTER KHALID BIN WALEED,RD KARACHI",
        "address2": " "
    },
    {
        "code": "1105",
        "address1": "OFF 124 PLOT 2/1 H.M.H SQUARE NEAR HASSAD SQUARE SIR SHAH SULAIMAN RO BLOCK 12 KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "1106",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1107",
        "address1": "ST - 2/12, SECTOR - 19\r\nKORANGI INDUSTRIAL AREA \r\nKARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "1108",
        "address1": "CAPITAL ROAD, SIALKOT, PAKISTAN",
        "address2": " "
    },
    {
        "code": "1109",
        "address1": "KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "1110",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1111",
        "address1": "UNIBRO HOUSE 114 9TH EAST STREET PHASE-1,D D.H.A KARACHI",
        "address2": " "
    },
    {
        "code": "1112",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1113",
        "address1": "248-A BLOCK-6 PECHS SHAHRAH-E-FAISAL",
        "address2": "KARACHI-PAKISTAN "
    },
    {
        "code": "1114",
        "address1": "E-20/B, CENTRAL AVENUE, S.I.T.E KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "1115",
        "address1": "SHAHEEN VIEW, SUITE#: 13, 18-A, BLOCK-6, P.E.C.H.S. SHAHRAH-E-FAISAL, KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "1116",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1117",
        "address1": "SUITE, 707, 7TH FLOOR BUISNESS CENTRE\r\nMUMTAZ HASSAN ROAD KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "1118",
        "address1": "Suite No. 11/12, 11th Floor, Arkay Square (EXT) Shahrah-e-Liaqat, Karachi, PAKISTAN",
        "address2": " "
    },
    {
        "code": "1119",
        "address1": "ROOM NO 303 3RD FLOOR BLOCK-B BUILDING NO 3 LAKSON SQUARE OPPISTE PRESS CLUB SARWAR SHAHEED ROAD SADDAR KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "1120",
        "address1": "PLOT NO. 2 & 17 SECTOR 20",
        "address2": "KORANGI INDUSTRIAL AREA, KARACHI 74900 PAKISTAN "
    },
    {
        "code": "1121",
        "address1": "KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "1122",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1123",
        "address1": "SUITE NO 1 & 10, 10TH FLOOR, SHARJAH TRADE CENTRE\r\nNEW CHALLI ROAD \r\nKARACHI \r\nPAKISTAN",
        "address2": " "
    },
    {
        "code": "1124",
        "address1": "POLT.NO. C 21 AL HABIB SOCIETY GULSHAN. E.MAYMAR KARACHI PAKISTAN TEL: 0300-2262819",
        "address2": " "
    },
    {
        "code": "1125",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1126",
        "address1": "HOUSE NO E-153-A NEW SUPER TOWN WALTON ROAD LAHORE 54000 PUNJAB PAKISTAN",
        "address2": " "
    },
    {
        "code": "1127",
        "address1": "TECHNOLOGY DRIVE, 14 KM, PASRUR ROAD,  SIALKOT   PAKISTAN",
        "address2": " "
    },
    {
        "code": "1128",
        "address1": "3-KM BAHAWALPUR BYPASS BAHAWALPUR ROAD,\r\nMULTAN-CITY",
        "address2": " "
    },
    {
        "code": "1129",
        "address1": "PLOT.NO SOMMAR CHATTA GOTH PREM VILLAS MALIR CANTT KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "1130",
        "address1": "130-R/3, JOHAR TOWN LAHORE, PAKISTAN \r\n",
        "address2": " "
    },
    {
        "code": "1131",
        "address1": "Ground floor Old saudia Arabian Airline Building AFU Airport Karachi",
        "address2": " "
    },
    {
        "code": "1132",
        "address1": "62/24 GHAZI ROAD CANTT - SIALKOT",
        "address2": "TEL: +92 (052) 3241483 / 3241483/4. FAX: +92 (052) 3241482. "
    },
    {
        "code": "1133",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1134",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1135",
        "address1": "Suite#M29,Mezzanine Floor,Mateen shopping Gallery,\nTariq Road PECHS,Oop Rehmania Masjid,\nKarachi Pakistan\nMob:+923222093330\nTel:+92-21-34256987\nTel:+92-21-32039939\nTel:+92-21-34256942\nEmail:wls@groupmail.com",
        "address2": "worldlinkshipping@cyber.net.pk "
    },
    {
        "code": "1136",
        "address1": "SUITE 209 CHAPAL PLAZA HASRAT MOHANI ROAD KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "1137",
        "address1": "PLOT NO 13 B SMALL INDUSTRIES ESTATES SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "1138",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1139",
        "address1": "MOHALLAH NIZAMABAD ZAFARWAL ROAD, SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "1140",
        "address1": "SHOP NO. 208 NEW SABZI MANDI, GATE NO. 2 FRUIT MARKET SUPER HIGHWAY KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "1141",
        "address1": "OFFICE 502 5TH FLOOR FAZAL CENTRE",
        "address2": " "
    },
    {
        "code": "1142",
        "address1": "PLOT NO.LC-45 LANDHI INDUSTRIAL AREA 74900",
        "address2": "KARACHI-PAKISTAN "
    },
    {
        "code": "1143",
        "address1": "16 SCHEME NO.2 FARID TO N KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "1144",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1145",
        "address1": "SUITE 504, FIFTH FLOOR\r\nI.I CHUNDRIGAR ROAD, \r\nKARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "1146",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1147",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1148",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1149",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1150",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1151",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1152",
        "address1": "KARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "1153",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1154",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1155",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1156",
        "address1": "International Freight & Logistics Management\r\nSuite No. 413, 4/F, Chapal Plaza | Hasrat Mohani Road\r\nOff. I.I.Chundrigar Road | Karachi | Pakistan.",
        "address2": " "
    },
    {
        "code": "1157",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1158",
        "address1": "OFFICE# B-704 ,7TH FLOOR,\r\nSAIMA TRADE TOWER, II CHUNDRIGAR ROAD,KARACHI PAKISTAN\r\n\r\n\r\n",
        "address2": " "
    },
    {
        "code": "1159",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1160",
        "address1": "SUITE: 107, TRADE TOWER, ABDULLAH HAROON ROAD, KARACHI \r\n",
        "address2": " "
    },
    {
        "code": "1161",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1162",
        "address1": "KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "1163",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1164",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1165",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1166",
        "address1": "SUITE#301, PROGRESSIVE SQUARE, BLOCK 6, P.E.C.H.S., KARACHI -(PAKISTAN).",
        "address2": " "
    },
    {
        "code": "1167",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1168",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1169",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1170",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1171",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1172",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1173",
        "address1": "SUITE # 108, 1ST FLOOR IBRAHIM TRADE TOWER,\r\nPLOT NO.1, BLOCK-7/8, MAQBOOLABAD\r\nMAIN SHAHRAH-E-FAISAL P.E.C.H.S\r\nKARACHI - PAKISTAN\r\n",
        "address2": " "
    },
    {
        "code": "1174",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1175",
        "address1": "KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "1176",
        "address1": "KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "1177",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1178",
        "address1": "KARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "1179",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1180",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1181",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1182",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1183",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1184",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1185",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1186",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1187",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1188",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1189",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1190",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1191",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1192",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1193",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1194",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1195",
        "address1": "SUITE # 105, 1ST FLOOR, PARSA TOWERS MAIN SHARAH-E-FAISAL, KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "1196",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1197",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1198",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1199",
        "address1": "SUITE #1312, 13TH FLOOR, SAIMA TRADE TOWER “B” OPP:\r\nJANG PRESS I.I. CHUNDRIGAR ROAD KARACHI, PAKISTAN,",
        "address2": " "
    },
    {
        "code": "1200",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1201",
        "address1": "51 - TIMBER POND, KEAMARI 75620, KARACHI - PAKISTAN",
        "address2": " "
    },
    {
        "code": "1202",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1203",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1204",
        "address1": "SUITE NO. 208-210, 2ND FLOOR  CHAPAL PLAZA HASRAT MOHANI ROAD\r\nKARACHI -74000 PAKISTAN",
        "address2": " "
    },
    {
        "code": "1205",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1206",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1207",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1208",
        "address1": "KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "1209",
        "address1": "SHAHRAH E FAISAL PECHS SOCIETY PROGRESSIVE CENTER                          SUIT NO 309 KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "1210",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1211",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1212",
        "address1": "Unit 909, 9th Floor, Lu Plaza, 2 Wing Yip Street, Kwun Tong, Kowloon, Hong Kong \r\n",
        "address2": " "
    },
    {
        "code": "1213",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1214",
        "address1": "KARACHI",
        "address2": " "
    },
    {
        "code": "1215",
        "address1": "1 East Lincoln Ave\r\nValley Stream, NY 11580 \r\n",
        "address2": " "
    },
    {
        "code": "1216",
        "address1": "181 S. FRANKLIN AVE, SUITE 103",
        "address2": "VALLEY STREAM NY 11581 USA. TEL: 718-305-4327"
    },
    {
        "code": "1217",
        "address1": "E-595, 3RD FLOOR, ABOVE ANDHRA BANK RAMPHAL CHOWK SECTOR -7 DWARKA NEW DEHLI-110077  INDIA",
        "address2": " "
    },
    {
        "code": "1218",
        "address1": "101-1404Rm, Lotte Castle president, #467 Gong Deok-Dong, Mapo-Ku, Seoul, Korea\r\n",
        "address2": " "
    },
    {
        "code": "1219",
        "address1": "11/24 Ratchadapisek Road, Chongnonsee, Yannawa, Bangkok 10120",
        "address2": " "
    },
    {
        "code": "1220",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1221",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1222",
        "address1": "KARACHI",
        "address2": " "
    },
    {
        "code": "1223",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1224",
        "address1": "SARMIENTO 1190 PISO 8 C1041AAX, REPUBLICA ARGENTINA.",
        "address2": " "
    },
    {
        "code": "1225",
        "address1": "Certified Transport Group 195 Oval Drive ",
        "address2": "Islandia NY 11749  "
    },
    {
        "code": "1226",
        "address1": "Room 13A08, Huichuang International Plaza, \r\nNo. 275-8,East Guoding Road,Yangpu District,Shanghai 200433,China\r\n",
        "address2": " "
    },
    {
        "code": "1227",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1228",
        "address1": "5th Floor, Grosvenor House, \r\nProspect Hill, Redditch, Worcs, B97 4DQ UNITED KINGDOM\r\n",
        "address2": " "
    },
    {
        "code": "1229",
        "address1": "LEBENT MH, SULUN SK. NO. 10 VILLA CTT 34330 - BESIKTAS - ISTANBUL - TUKEY",
        "address2": " "
    },
    {
        "code": "1230",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1231",
        "address1": "FIRST FLOOR PARKLAND-I, NO.33, PARK STREET, COLOMBO 02\r\n\r\n",
        "address2": " "
    },
    {
        "code": "1232",
        "address1": "14 AVENUE DU VALQUIOU, BATIMENT C6\r\n93290 TREMBLAY EN FRANCE\r\n",
        "address2": " "
    },
    {
        "code": "1233",
        "address1": "karachi, pakistan",
        "address2": " "
    },
    {
        "code": "1234",
        "address1": "Suite 1601-2, Level 16, Tower 2,\r\nWisma AmFIRST, Jalan SS7/15,\r\n(Jalan Stadium), 47301 Kelana Jaya,\r\nSelangor Darul Ehsan, Malaysia\r\n",
        "address2": " "
    },
    {
        "code": "1235",
        "address1": "5110 12th Ave",
        "address2": "Brooklyn NY 11219 "
    },
    {
        "code": "1236",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1237",
        "address1": "25 highfield road, dartford,kent.DA1 2JS",
        "address2": " "
    },
    {
        "code": "1238",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1239",
        "address1": "No 30/5, Gothami Lane, Gothami Road, Colombo 8. Sri Lanka. \r\n\r\n\r\n",
        "address2": " "
    },
    {
        "code": "1240",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1241",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1242",
        "address1": "National Control Tower",
        "address2": " "
    },
    {
        "code": "1243",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1244",
        "address1": "STOKKAMYRVEIEN 22",
        "address2": "4313 SANDNES NORWAY "
    },
    {
        "code": "1245",
        "address1": "Hermes Germany GmbH\r\nGeb. 579A, Cargo City Süd\r\nD-60549 Frankfurt\r\n",
        "address2": " "
    },
    {
        "code": "1246",
        "address1": "20/III, 29TH STREET, KHAYABAN E SHAMSHEER, PHASE-V EXT DEFENCE HOUSING AUTHORITY KARACHI",
        "address2": " "
    },
    {
        "code": "1247",
        "address1": "VIA RIVOLTANA,  35 \r\n20096 PIOLTELLO-MILAN - ITALY\r\nPHONE: +39 02 9595131 FAX: +39 02 95328299",
        "address2": " "
    },
    {
        "code": "1248",
        "address1": "c/o Milestone",
        "address2": " "
    },
    {
        "code": "1249",
        "address1": "Warehouse #1080 Dubai Cargo Village",
        "address2": "Dubai U A E  "
    },
    {
        "code": "1250",
        "address1": "FRANKFURT AM PRIME PARC 7, 65479 RAUNHEIM.",
        "address2": " "
    },
    {
        "code": "1251",
        "address1": "JOHANNISBOLLWERK 16,\r\n20459 HAMBURG",
        "address2": " "
    },
    {
        "code": "1252",
        "address1": "WILANOW OFFICE PARK\r\n02-972 WARSZAWA, UL ADAMA BRANICKIEGO POLAN",
        "address2": " "
    },
    {
        "code": "1253",
        "address1": "BROADOAK INDUSTRIAL PARK, ASHBURTON ROAD WEST, TRAFFORD PARK, MANCHESTER M17 1RW, UNITED KINGDOM\r\nTEL: +44-161 873 1452\r\nFAX: +44-161 872 9016",
        "address2": " "
    },
    {
        "code": "1254",
        "address1": "1406 Peach Street\r\nErie, PA 16501 USA",
        "address2": " "
    },
    {
        "code": "1255",
        "address1": "F / 418 S.I.T.E. KARACHI PAKISTAN TEL # +92 (021) 2579361 UPTO 2 &  021-2576506.",
        "address2": "FAX # +92 (021) 2575979 "
    },
    {
        "code": "1256",
        "address1": "Oriel House, Unit F, \r\nBrooklands Sunbury on Thames Middlesex United Kingdom\r\n",
        "address2": " "
    },
    {
        "code": "1257",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1258",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1259",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1260",
        "address1": "250MTS O y 150N de EPA    Asunción de Belen,\r\nHeredia, Costa Rica. Ced\r\n TAX ID: 3-101-67061513\r\n",
        "address2": " "
    },
    {
        "code": "1261",
        "address1": "NO 9 AYRSHIRE AVENUE LONGMEADOW BUSINESS ESTATE EDENVALE 1610",
        "address2": " "
    },
    {
        "code": "1262",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1263",
        "address1": "T 95-A  4th Floor  CL House, Yusuf Sarai Commercial Centre,\r\nGautam Nagar, New Delhi-110049, India.\r\n",
        "address2": " "
    },
    {
        "code": "1264",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1265",
        "address1": "UL. MORSKA 59,\r\n81-323 GDYNIA\r\nPOLAND",
        "address2": " "
    },
    {
        "code": "1266",
        "address1": "22 Abagar Str.\r\nSofia City Logistic Park\r\n1138 Sofia, Bulgaria\r\n",
        "address2": " "
    },
    {
        "code": "1267",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1268",
        "address1": "SEELANDSTRASSE 15\r\n23569 LÜBECK,GERMANY",
        "address2": " "
    },
    {
        "code": "1269",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1270",
        "address1": "VAN MAASDIJKWEG 53 3088 ED ROTTERDAM",
        "address2": "THE NETHERLANDS "
    },
    {
        "code": "1271",
        "address1": "KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "1272",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1273",
        "address1": "INTERNATIONALE SPEDITION GRIMM 8, 20457, HAMBURG, GERMANY",
        "address2": " "
    },
    {
        "code": "1274",
        "address1": "25TH KM MAIN NATIONAL HIGHWAY,\r\nLANDHI INDUSTRIAL AREA,\r\nKARACHI 75160, PAKISTAN\r\n",
        "address2": " "
    },
    {
        "code": "1275",
        "address1": "26/55 chan space building 4th floor nanglinch road thungmahamek sathorn bangkok 10120",
        "address2": " "
    },
    {
        "code": "1276",
        "address1": "ruko bukit gading mediterania A-01 kelapa gading Jakarta Utara 14240",
        "address2": " "
    },
    {
        "code": "1277",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1278",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1279",
        "address1": "NO. 651/35, ELVITIGALA MAWATHA, COLOMBO-05",
        "address2": " "
    },
    {
        "code": "1280",
        "address1": "Avda. de la Industria, 48 - 2º\r\n28823 Coslada (Madrid)\r\n\r\n",
        "address2": " "
    },
    {
        "code": "1281",
        "address1": "SINGAPORE",
        "address2": " "
    },
    {
        "code": "1282",
        "address1": "46/7, VALIANT TOWERS LEVEL 1 & 5 46/7\r\nNAWAM MAWATHA COLOMBO 02 SRI LANKA. \r\nTel:+ 94 11 4 724516. Fax:+ 94 11 4 724517.",
        "address2": " "
    },
    {
        "code": "1283",
        "address1": "MAST LIFE NISHI-SHINBASHI BUILDING 8F\r\n3-6-10, NISHI SHINBASHI, MINATO KU,\r\nJAPAN 105-0003",
        "address2": " "
    },
    {
        "code": "1284",
        "address1": "SEKO INTERNATIONAL FREIGHT FORWARDING (SHANGHAI) CO,. LTD.\r\nROOM 1502 & 1503, SHANGHAI LITONG PLAZA, NO. 1350, NORTH SI CHUAN ROAD, HONG KOU DISTRICT, SHANGHAI. 200080",
        "address2": " "
    },
    {
        "code": "1285",
        "address1": "16b Paarden Eiland Road Paarden Eiland",
        "address2": "7405 SA Cape Town , South Africa 7405 email adrian.vanveen@sekogln.co.za Office: 021-510-1678"
    },
    {
        "code": "1286",
        "address1": "SUITE 18 GENESIS CENTRE GARRETT FIELD BIRCHWOOD WARRINGTON CHESHIRE WA3 7BH TEL (44) 1925 909400",
        "address2": " DIRECT (44) 1925 909401 FAX (44) 161 209 7449 "
    },
    {
        "code": "1287",
        "address1": "BIRCH HOUSE FAIRFIELD AVENUE STAINES",
        "address2": "UPON THAMES TW18 4AB "
    },
    {
        "code": "1288",
        "address1": "STATION: ROC 1600 LEXINGTON AVENUE SUITE 111, DOCK 107 ROCHESTER, NY 14606 TEL: 585-235-4221 FAX: 585-247-5122 E-MAIL: nicole.bruce@sekologistics.com",
        "address2": " "
    },
    {
        "code": "1289",
        "address1": "5445 OLD DIXIE HIGHWAY, SUIT 200 FOREST PARK, GA 30297",
        "address2": " "
    },
    {
        "code": "1290",
        "address1": "5065 NW 74 Ave., Bulding A, Miami - FL 33166",
        "address2": " "
    },
    {
        "code": "1291",
        "address1": "GAMLE LEIRDALSVEI 12\r\n1081 OSLO P.O.BOX 6153. ETTERSTAD\r\n0602, OSLO",
        "address2": " "
    },
    {
        "code": "1292",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1293",
        "address1": "UNIT F, MEDINA CHAMBERS TOWN QUAY, SOUTHAMPTON, HAM S014 2AQ. U.K",
        "address2": " "
    },
    {
        "code": "1294",
        "address1": "20 BRIGADE ROAD, AIRPORT OAKS, AUKLAND, NEW ZEALAND",
        "address2": " "
    },
    {
        "code": "1295",
        "address1": "7345 Mission Gorge Road, STE J San Diego CA 92120 - USA",
        "address2": " "
    },
    {
        "code": "1296",
        "address1": "7045. TROY HILL DRIVE. SUITE 300, ELKRIDGE MD 21075 US",
        "address2": " "
    },
    {
        "code": "1297",
        "address1": "P.O. BOX 71141, CHICAGO IL 60694-1141. USA",
        "address2": " "
    },
    {
        "code": "1298",
        "address1": "1920 PREMIER ROW, ORLANDO FL 32809, UNITED STATES",
        "address2": " "
    },
    {
        "code": "1299",
        "address1": "\r\nPLOT NO. E-87 SECTOR 31/D, P&T SOCIETY\r\nKORANGI INDUSTRIAL AREA,\r\nKARACHI - PAKISTAN.\r\n",
        "address2": " "
    },
    {
        "code": "1300",
        "address1": "(SAL) SHANGHAI ANLAI INTERNATIONAL CARGO AND FREIGHT AGENT CO. LTD/CO SHANGHAI SENTING INTERNATIONAL FREIGHT FORWARDING CO LTD",
        "address2": " "
    },
    {
        "code": "1301",
        "address1": "ROOM I305 LOFT 10 HI-SHANGHAI NO 990 DALAIN ROAD SHANGHAI 200092 CHINA",
        "address2": " "
    },
    {
        "code": "1302",
        "address1": "Room 904,No.228,Siping Road,World Business Building,\r\nHongkou District,Shanghai,China\r\n",
        "address2": " "
    },
    {
        "code": "1303",
        "address1": "N-67, MIDDLE CIRCLE,  CONNAUGHT PLACE, NEW DELHI-110001, INDIA",
        "address2": " "
    },
    {
        "code": "1304",
        "address1": "A-128 & 129 Mahipalpur Extn.",
        "address2": "N.H-8 New Delhi-110037 "
    },
    {
        "code": "1305",
        "address1": "P.O.BOX-62419,DUBAI,UNITED ARAB EMIRATES.,",
        "address2": " "
    },
    {
        "code": "1306",
        "address1": "Via Central de Milheirós, 726\r\nMilheirós\r\n4475-330 Maia\r\nPortugal\r\n",
        "address2": " "
    },
    {
        "code": "1307",
        "address1": "1745 PHOENIX BOULEVARD, SUITE 380",
        "address2": "ATLANTA, GA 30349 PHONE: 404-883-3188 FAX: 678-927-9522 ATTN: WILLIAM F. PHILLIPS "
    },
    {
        "code": "1308",
        "address1": "Smederijstraat 2 4814 DB Breda The Netherlands",
        "address2": "Attn: Ms. Olga Belskaya "
    },
    {
        "code": "1309",
        "address1": "3FL., No 16, Sec. 1, Nanjing E.Rd., Taipei City 104, Taiwan  TAX ID :86865094\r\n",
        "address2": " "
    },
    {
        "code": "1310",
        "address1": "12/166 ADARSH INDL ESTATE\r\nSAHAR ROAD,CHAKALA,\r\nANDHERI (EAST)\r\nMUMBAI 400 099\r\nINDIA \r\n",
        "address2": " "
    },
    {
        "code": "1311",
        "address1": "627-A ALJUNIED ROAD  #10-02 BIZTECH CENTRE SINGAPORE 389842",
        "address2": "TEL : +65 6846 8878, FAX : +65 6846 8798 "
    },
    {
        "code": "1312",
        "address1": "171, THE ATRIUM, WHITEFIELD, BURY\r\nNEW ROAD, M45 7AL UK\r\n",
        "address2": " "
    },
    {
        "code": "1313",
        "address1": "UNITED STATE OF AMERICA.",
        "address2": " "
    },
    {
        "code": "1314",
        "address1": "Via Cassanese 224 - Centro Direzionale Milano Oltre - Palazzo Caravaggio,\r\n20090 Segrate MI, Italy\r\n",
        "address2": " "
    },
    {
        "code": "1315",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1316",
        "address1": "Boerendijk 27, B-2180 Antwerp Ekeren BELGIUM",
        "address2": " "
    },
    {
        "code": "1317",
        "address1": "AHMED RAJABLI STREET 8 AZ1075 BAKU AZE",
        "address2": " "
    },
    {
        "code": "1318",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1319",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1320",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1321",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1322",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1323",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1324",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1325",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1326",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1327",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1328",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1329",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1330",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1331",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1332",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1333",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1334",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1335",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1336",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1337",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1338",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1339",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1340",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1341",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1342",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1343",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1344",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1345",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1346",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1347",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1348",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1349",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1350",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1351",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1352",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1353",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1354",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1355",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1356",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1357",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1358",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1359",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1360",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1361",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1362",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1363",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1364",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1365",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1366",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1367",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1368",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1369",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1370",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1371",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1372",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1373",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1374",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1375",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1376",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1377",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1378",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1379",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1380",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1381",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1382",
        "address1": "KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "1383",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1384",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1385",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1386",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1387",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1388",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1389",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1390",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1391",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1392",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1393",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1394",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1395",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1396",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1397",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1398",
        "address1": "KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "1399",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1400",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1401",
        "address1": "KARACHI",
        "address2": " "
    },
    {
        "code": "1402",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1403",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1404",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1405",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1406",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1407",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1408",
        "address1": "SUITE # 105, 1ST FLOOR, PARSA TOWERS MAIN SHARAH-E-FAISAL, KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "1409",
        "address1": "Office  No: 11  First Floor Puri House,\r\nWest Wharf Road Karachi -74000-Pakistan.\r\n",
        "address2": " "
    },
    {
        "code": "1410",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1411",
        "address1": "SINGAPORE",
        "address2": " "
    },
    {
        "code": "1412",
        "address1": "MACGREGOR QUEENSLAND 4109 MELBOURNE AU",
        "address2": " "
    },
    {
        "code": "1413",
        "address1": "58B THAMES INDUSTRIAL ESTATE PRINCESS MARGARET ROAD EAST TILBURY ESSEX RM 188RH LONDON UNITED KINGDOM",
        "address2": " "
    },
    {
        "code": "1414",
        "address1": "UNIT 6 FOUNDRY 10 WIDNES BUSINESS PARK WATERSIDE LANE WIDNES CHESHIRE WA8 8GU UK",
        "address2": " "
    },
    {
        "code": "1415",
        "address1": "137-139 SUTHERLAND ROAD ST3 1HZ",
        "address2": " "
    },
    {
        "code": "1416",
        "address1": "PROCESSING CENTER COOL SINGEL 119 3012 AG ROTTERDAM",
        "address2": " "
    },
    {
        "code": "1417",
        "address1": "104 ABERCORN STREET PAISLEY GALSGOW UK PA3 4AY",
        "address2": " "
    },
    {
        "code": "1418",
        "address1": "BAKU AZERBAIJAN PHN: +994125251117 CONTACT PERSON SAMIG HASANLI",
        "address2": " "
    },
    {
        "code": "1419",
        "address1": "VIA ANZIO 18INT 2 59100 PRATO (PO) ITALY",
        "address2": " "
    },
    {
        "code": "1420",
        "address1": "NAZER HUSSAIN RIZAI ORGANISATION NUMBER 7802175799 PORTRNSGATAN 5 21646 LIMHAMIN SWEDEN",
        "address2": " "
    },
    {
        "code": "1421",
        "address1": "WORLD FREIGHT TERMINAL UNIT 1A BUILDING 303 MANCHESTER AIRPORT GB M905UJ GROSSBRITANNIEN CONTACT PERSON GARY",
        "address2": " "
    },
    {
        "code": "1422",
        "address1": "DOHA QATAR",
        "address2": " "
    },
    {
        "code": "1423",
        "address1": "AL-REHMAN ENTERPRISES INC 53 WALBROCK ROAD",
        "address2": " "
    },
    {
        "code": "1424",
        "address1": "UNIT 1 AIRPORT BUSINESS PARK CARDIFF INTERNATIONAL AIRPORT",
        "address2": " "
    },
    {
        "code": "1425",
        "address1": "C23 C24 NEW SMITHFIELD MARKET OPENSHAW MANCHESTER",
        "address2": " "
    },
    {
        "code": "1426",
        "address1": "LEVEL 6 AL ANSARI BUSINESS CENTER BEHIND MALL UAE TEL: +971 4 501 0540",
        "address2": " "
    },
    {
        "code": "1427",
        "address1": "KUWAIT",
        "address2": " "
    },
    {
        "code": "1428",
        "address1": "P.O BOX NO 10935 MANAMA BAHRAIN",
        "address2": " "
    },
    {
        "code": "1429",
        "address1": "P.O BOX 10935 MANAMA BAHRAIN",
        "address2": " "
    },
    {
        "code": "1430",
        "address1": "W L L B O BOX NO 10593 MANAMA BAHRAIN",
        "address2": " "
    },
    {
        "code": "1431",
        "address1": "OKERN TCG VEI 03-0530 OSLO NORWAY TEL: 0047 97773939",
        "address2": " "
    },
    {
        "code": "1432",
        "address1": "DOHA QATAR",
        "address2": " "
    },
    {
        "code": "1433",
        "address1": "TRADING UG FRANKFURT",
        "address2": " "
    },
    {
        "code": "1434",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1435",
        "address1": "DOHA QATAR",
        "address2": " "
    },
    {
        "code": "1436",
        "address1": "CR NO 150651 P.O BOX 1236 NEW INDUSTRIAL AREA ST # 20 DOHA QATAR",
        "address2": " "
    },
    {
        "code": "1437",
        "address1": "P.O BOX NO 47040 KUWAIT TEL: 0098 678567845",
        "address2": " "
    },
    {
        "code": "1438",
        "address1": "KUWAIT",
        "address2": " "
    },
    {
        "code": "1439",
        "address1": "UNIT 34-36, ST JAMES MARKET BRADFORD BD4 7 PQ, U.K.",
        "address2": " "
    },
    {
        "code": "1440",
        "address1": "TRADING Q.L.L KUWAIT",
        "address2": " "
    },
    {
        "code": "1441",
        "address1": "NO 1333 WENJU ROAD CUSTOM BUILDING B728 PUDONG SHANGHAI CHINA  USCI NO 9131011577094901XQ",
        "address2": " "
    },
    {
        "code": "1442",
        "address1": "181 S FRANKLIN AVE SUITE 609 VALLEY STREAM NY 11581 TEL: 718-305-4327",
        "address2": " "
    },
    {
        "code": "1443",
        "address1": "SCHAFFHAUSERSTRASSE 449 8052 ZURICH",
        "address2": " "
    },
    {
        "code": "1444",
        "address1": "40 GR LAMPRAKI STR GR 14342 NEA FILADEFIA ATHENS GREECE",
        "address2": " "
    },
    {
        "code": "1445",
        "address1": "65989824 CALLE CARMAN 59,1-1 PC, 0800 SERVICES A BARCELONA SPAIN",
        "address2": " "
    },
    {
        "code": "1446",
        "address1": "9999 BELLAIRE BLVD HOUSTON TEXAS 77036 USA.",
        "address2": " "
    },
    {
        "code": "1447",
        "address1": "125371107 GERANIOU 8. ATHENS 10552 GREECE",
        "address2": " "
    },
    {
        "code": "1448",
        "address1": "141 49 HUDDING STOCKHOLM SWEDEN 14149 SE 00472 8338892-1",
        "address2": " "
    },
    {
        "code": "1449",
        "address1": "UL. ALEJA POKOJU 18 31-564 KRAKOW POLAND NIP 679 38 03 90",
        "address2": " "
    },
    {
        "code": "1450",
        "address1": "C AMI BOND STORE TULLAMARINE VIC 3043 TEL 03 9328 3833",
        "address2": " "
    },
    {
        "code": "1451",
        "address1": "UNIT 1 FISHPONDS ESTATE FISHPONDS ROAD WORKINGHAM BERKSHIRE RG41 2QJ UK ATTN DYLAN TERRY TEL: +44 07493 868876",
        "address2": " "
    },
    {
        "code": "1452",
        "address1": "08001 BARCELONA ESPANA 40 078672 B CALLE SANT ANTONI ABAT 38 LOC",
        "address2": " "
    },
    {
        "code": "1453",
        "address1": "SHOP NO 131 BLOCK NO 4 P.O BOX 3262 CENTRAL FRUITS & VEGETABLES MARKET BAS AL KHOR DUBAI UAE",
        "address2": " "
    },
    {
        "code": "1454",
        "address1": "POSTAL CODE 17065 SOLNA STOCKHOLM SWEDEN",
        "address2": " "
    },
    {
        "code": "1455",
        "address1": "C/O SHAFI PHARM IMPORT HORIA ROAD LIME BUILDING HARGESIA SOMALIA TEL: 21166433",
        "address2": " "
    },
    {
        "code": "1456",
        "address1": "RAHEEN BUSINESS PARK LIMERICK V94 2X26 IRLAND FRANK MCNAMARA OFFICE +35361 500 700",
        "address2": " "
    },
    {
        "code": "1457",
        "address1": "AMEER SALMAN STREET AL FAISALIYAH RIYADH KINGDOM OF SAUDIA ARABIA",
        "address2": " "
    },
    {
        "code": "1458",
        "address1": "KENNT WAY TROW DRIDGE WILTSHIRE LONDON UK",
        "address2": " "
    },
    {
        "code": "1459",
        "address1": "100 1339 GW ALMERE THE NETHERLAND",
        "address2": " "
    },
    {
        "code": "1460",
        "address1": "DBA MANDARIN ORIENTAL DOHA\r\nBARAHAT MSHEIREB STREET, MSHEIREB DOWNTOWN DOHA POSTAL ADDRESS PO BOX 23643, DOHA, QATAR  TELEPHONE +974-4008-8888 MOBILE +974 31581972\r\nEMAIL pthekkekara@mohq.com ATTN.: P",
        "address2": "RAJITH THEKKEKARA "
    },
    {
        "code": "1461",
        "address1": "DBA MANDARIN ORIENTAL DOHA BARAHAT MSHEIREB STREET MSHEIREB DOWNTOWN DOHA POSTAL ADDRESS PO BOX 23643 DOHA QATAR",
        "address2": " "
    },
    {
        "code": "1462",
        "address1": "TAWAZUN INDUSTRIAL PARK AL SAAD ROAD SWEIHAN ABU DHABI TEL: +97156 6877721",
        "address2": " "
    },
    {
        "code": "1463",
        "address1": "840 TOLLGATE ROAD ELGIN ILLINIOS 60123 USA",
        "address2": " "
    },
    {
        "code": "1464",
        "address1": "189 LURGAN ROAD, MAGHERALIN, COUNTY\r\nCOUNTY DOWN BT OQS",
        "address2": " "
    },
    {
        "code": "1465",
        "address1": "C/O TIMMI NWEKE 51 LIMCA ROAD NKPOR ONITSHA ANAMBRA STATE NIGERRIA BA 07620216625623",
        "address2": " "
    },
    {
        "code": "1466",
        "address1": "7050W STATE RD 84 STE 1 DAVIIE  FL 33317 USD TEL: +954 636 2272",
        "address2": " "
    },
    {
        "code": "1467",
        "address1": "BANKINTER SA MADRID",
        "address2": " "
    },
    {
        "code": "1468",
        "address1": "UNIT 3 THE BELL CENTRE MEWTON ROAD CRAWLEY RH10 9FZ VAT 359217186 EORI NUMBER 027830717000",
        "address2": " "
    },
    {
        "code": "1469",
        "address1": "C/O GREEN PHARM LTD EAST PLAZA SOUTH STREET NASSAU BAHAMAS",
        "address2": " "
    },
    {
        "code": "1470",
        "address1": "WEST INDIES",
        "address2": " "
    },
    {
        "code": "1471",
        "address1": "C/O DALSAN TRADING EAST PALAZA SOUTH STREET NASSAU BAHAMAS TEL: 1-242-234-1341",
        "address2": " "
    },
    {
        "code": "1472",
        "address1": "C/O CPSL WATER HIGHWAY SIR GROUP",
        "address2": " "
    },
    {
        "code": "1473",
        "address1": "P O BOX 80451 DOHA QATAR",
        "address2": " "
    },
    {
        "code": "1474",
        "address1": "AIRPORTSTRABE A-2410 FISCHAMEND AUSTRIA",
        "address2": " "
    },
    {
        "code": "1475",
        "address1": "MALLORY HOUSE BALDWING GATE NEW CASTLE UNDER LYME STAFFORSHIRE B78 GB TL 54222",
        "address2": " "
    },
    {
        "code": "1476",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1477",
        "address1": "NO 55 NEGOMBO ROAD PELIYAGODA SRILANKA",
        "address2": " "
    },
    {
        "code": "1478",
        "address1": "MR DOCTOR AHMED ADOUM N DJAMENA CHED TEL: 00235 65051215",
        "address2": " "
    },
    {
        "code": "1479",
        "address1": "10814 NW 33RD STREET SUITE 115 MIAMI FLORIDA 33712 USA",
        "address2": " "
    },
    {
        "code": "1480",
        "address1": "34 IRVINE AVENUE KENTON MIDDLESEX LONDON HA3 8QU UNITED KINGDOM",
        "address2": " "
    },
    {
        "code": "1481",
        "address1": "DIEGO CONTRERAS LIBERTAD 850/860 PISO B (C1012AAR) C A B A BUENOS AIRES",
        "address2": " "
    },
    {
        "code": "1482",
        "address1": "2 RUE VERLAINE 94410,\r\nST.MAURICE, PARIS - FRANCE",
        "address2": " "
    },
    {
        "code": "1483",
        "address1": "CORSO CADUTI DELLA LIBERTA 42 12038 SAVIGLIAN CN ITALY",
        "address2": " "
    },
    {
        "code": "1484",
        "address1": "NO 813 FASA 2J32040 SERI MANJONG PERAK MALAYSIA H/P +6011 21158602",
        "address2": " "
    },
    {
        "code": "1485",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1486",
        "address1": "ROAD BRADFORD BD3 7AE",
        "address2": " "
    },
    {
        "code": "1487",
        "address1": "SAN JUAN 1660 MAR DEL PLATA ARGENTINA CUIT 20228184897",
        "address2": " "
    },
    {
        "code": "1488",
        "address1": "CUIT 30-63748583-7 C.F MELO 2084 FLORIDA BUENOS AIRES ARGENTINA",
        "address2": " "
    },
    {
        "code": "1489",
        "address1": "NEW INDUSTRIAL AREA P O BOX 6016 AJMAX UAE",
        "address2": " "
    },
    {
        "code": "1490",
        "address1": "6405 NW 36TH ST # 119-121 MIAMI FL 33166 ATTN CHRISTIAN MORAN CONTACT # +44 0 203 290 2888",
        "address2": " "
    },
    {
        "code": "1491",
        "address1": "3480 LAIRD ROAD UNIT 9, MISSISSUAGA IN L5L 5Y4 905-820-1100",
        "address2": " "
    },
    {
        "code": "1492",
        "address1": "ODONTOLGICOS S.A AV DAS INDUSTRIAS ANTONIO CONRADO DE OLIVEIRA 90 37655 000 ITAPEVA MG BRASIL CNJP 14 190 675 0002 36 PHN 48 4009 0999",
        "address2": " "
    },
    {
        "code": "1493",
        "address1": "FOR FRUITS AND VEG ZONE 2 OFFICE 9 ZONE 2/21 CENTRE MARKET FOR FRUITS AND VEG KUWAIT",
        "address2": " "
    },
    {
        "code": "1494",
        "address1": "FOR FRUIT & VEGETABLES KUWAIT SULAIBIYA CENTRE MARKET FOR FRUIT AND VEGETABLES ZONEZ OFFICE KUWAIT",
        "address2": " "
    },
    {
        "code": "1495",
        "address1": "8000 WEST TOWER AVE MILWAUKEE WI 53223 USA",
        "address2": " "
    },
    {
        "code": "1496",
        "address1": "FARM BIRMINGHAM LIMITED UNIT 72, WHOLESALE MARKET PERSHORE STREET, BIRMINGHAM, B5 BUN.TELL NO.00447984686213",
        "address2": " "
    },
    {
        "code": "1497",
        "address1": "UNIT NO 72 WHOLESALE MARKET PETSHORE STREET LONDON UK B5 6UN G",
        "address2": " "
    },
    {
        "code": "1498",
        "address1": "FRUNDSBERGSTRASSE 36 D-87727 BABENHOUSEN GERMANY",
        "address2": " "
    },
    {
        "code": "1499",
        "address1": "922117381 NORBYGATE 150187 OSLO NORWAY",
        "address2": " "
    },
    {
        "code": "1500",
        "address1": "34111 RZESZOW UL KRAKOWSKA 154 WARSAW POLAND ATTN MR JERRY GRACE TEL; +48 017 860 16 30",
        "address2": " "
    },
    {
        "code": "1501",
        "address1": "203D EGIN CRESCENT EASTERN BUSINEES PARK LONDON HEATHROW",
        "address2": " "
    },
    {
        "code": "1502",
        "address1": "P O BOX NO 118519 DUBAI UNITED ARAB EMIRATES 042629408",
        "address2": " "
    },
    {
        "code": "1503",
        "address1": "UNIT 403B GRANTS PARK GREENOUGE ESTATE DUBLIN VAT NO 1E3687683VH",
        "address2": " "
    },
    {
        "code": "1504",
        "address1": "SOUTHERN REGIONS LTD 6 PONTAC ROAD SAXENBURG PARK 1 SOUTH AFRICA",
        "address2": " "
    },
    {
        "code": "1505",
        "address1": "305 CHE GUEVARA MOORE ROAD BEREA DURBUN 4001 SOUTH AFRICA",
        "address2": " "
    },
    {
        "code": "1506",
        "address1": "KLK 668 CHANDER ROAD",
        "address2": " "
    },
    {
        "code": "1507",
        "address1": "71 STREET NO 750 SHOP NO 129 P O BOX 21744 QATAR",
        "address2": " "
    },
    {
        "code": "1508",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1509",
        "address1": "BELISINGEL 41 1119 NT SCHIPHOL-RIJJK THE NETHERLAND",
        "address2": " "
    },
    {
        "code": "1510",
        "address1": "P.O BOX 46450 ABU DHABI, UNITED ARAB EMIRATES TEL +971(2)5757555",
        "address2": " "
    },
    {
        "code": "1511",
        "address1": "C/O SHIP SPARES IN TRANSIT MT SEABAS HAMRIYAH FREE ZONE SHARJAH",
        "address2": " "
    },
    {
        "code": "1512",
        "address1": "7 RUE AUDENET 93380 PIERREFITE SUR SERINE PARIS",
        "address2": " "
    },
    {
        "code": "1513",
        "address1": "FORD AND ROAD BEDFORD MK 40 4JT C/O SK FREIGHT SERVICES UK LTD AGENT CODE DHZ",
        "address2": " "
    },
    {
        "code": "1514",
        "address1": "12/14 TO 16 STOCKYARD PLACE\r\nWEST GOSFORD,NSW,2250 AUSTRAILIA",
        "address2": " "
    },
    {
        "code": "1515",
        "address1": "AKERN TORGVEI 1 N-0580, OSLO NORWAY",
        "address2": " "
    },
    {
        "code": "1516",
        "address1": "OSLO NORWAY SOLO NORWAY 0581 NO 0000000",
        "address2": " "
    },
    {
        "code": "1517",
        "address1": "PHARMACEUTICAL AND CONSUMER DIVISION NO 949 STREET 1982+1005 SANGKAT PHNOM PENH CAMBODIA",
        "address2": " "
    },
    {
        "code": "1518",
        "address1": "KHATTAN BLK-7 ST 71 BLDG KUWAIT",
        "address2": " "
    },
    {
        "code": "1519",
        "address1": "JILEEB SHUWAIKH SAFAT KUWAIT",
        "address2": " "
    },
    {
        "code": "1520",
        "address1": "GRORUDVEIEN 120 1053 OSLO NORWAY  TEL: 004795080867",
        "address2": " "
    },
    {
        "code": "1521",
        "address1": "5 QUAI DE LA SAONE 76600 LE HAVRE",
        "address2": " "
    },
    {
        "code": "1522",
        "address1": "VIA DELLA VOLTA 360 CAP 25124B IVA 04213910989 BTRESCIA ITALY BS 597360",
        "address2": " "
    },
    {
        "code": "1523",
        "address1": "BURFORD ROAD NOTIMGHAM NG76BA C/O AAA FREIGHT SERVICES LTD",
        "address2": " "
    },
    {
        "code": "1524",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1525",
        "address1": "204 PANDAN LOOP S 128394",
        "address2": " "
    },
    {
        "code": "1526",
        "address1": "SRL BY JAWAD VIA CADORE N. 12, 20030 SEVESO (MB) P.VIA C.F MILAN ITALY",
        "address2": " "
    },
    {
        "code": "1527",
        "address1": "IO BILLS LANE SHIRLY SOLIHULL B90 2NR LONDON UK C/O FREIGHT SERVICES UK UK LTD",
        "address2": " "
    },
    {
        "code": "1528",
        "address1": "AS HANEBORG ROAD 98 P O BOX 1472",
        "address2": " "
    },
    {
        "code": "1529",
        "address1": "FRONTIER HOUSE PIER ROAD FELTHAM MIDDESEX TW14 OTW UK",
        "address2": " "
    },
    {
        "code": "1530",
        "address1": "VIA PURGATORIO 135 80047 S GIUSEPPE VES NO NA ITALY",
        "address2": " "
    },
    {
        "code": "1531",
        "address1": "GA TELESIS UK LTD HANGER 103 AVIATION WAY BOURNEMOUTH INTERNATIONAL AIRPORT CHRISTCHURCH DORSET BH23 6NW UK",
        "address2": " "
    },
    {
        "code": "1532",
        "address1": "16415 JACINTOPORT BLVD HOUSTON TEXAS 77015 USA",
        "address2": " "
    },
    {
        "code": "1533",
        "address1": "ALCALDE ALEJANDRO CHANDEICK 221, LA REINA REGION METROPOLITANA.SANTIAGO CHILE POST CODE 7850125 \r\nPH:+56987698505",
        "address2": " "
    },
    {
        "code": "1534",
        "address1": "D9 NEW SMITH FIELD MARKET MANCHESTER M 11 2WW",
        "address2": " "
    },
    {
        "code": "1535",
        "address1": "D-9 NEW SMITH FIELD MARKET M112 WJ MANCHESTER GREAT BRITAIN",
        "address2": " "
    },
    {
        "code": "1536",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1537",
        "address1": "121 MULBERRY ORESENT WEST DRAYTON MIDDLESEX UB7 9AH",
        "address2": " "
    },
    {
        "code": "1538",
        "address1": "145A REGINA ROAD SOTHALL UB2 5PR U.K TEL: 44-7984-587312",
        "address2": " "
    },
    {
        "code": "1539",
        "address1": "C/O HA VP LTD HALIFAX STREET ST GEORGES GRENADA",
        "address2": " "
    },
    {
        "code": "1540",
        "address1": "145A REGINA ROAD SOUTHALD UB2 5PR U.K",
        "address2": " "
    },
    {
        "code": "1541",
        "address1": "C R NO 15404 WHOLE SALE MARKET SHOP 71 TO 76 P O BOX 15869 DOHA QATAR",
        "address2": " "
    },
    {
        "code": "1542",
        "address1": "C/O HAFIZ MUHAMMAD SALMAN GHULAM ABBAS BUILDING SAFE 5 STREET AL KIFAH AL YASMEEN AL RIYADH SAUDIA ARABAIA",
        "address2": " "
    },
    {
        "code": "1543",
        "address1": "MANCHESTER UK",
        "address2": " "
    },
    {
        "code": "1544",
        "address1": "C/O DR ABDULAZIZ A FARAH MUBARAK PHARMACEUICAL CO HARGEISA",
        "address2": " "
    },
    {
        "code": "1545",
        "address1": "C/O SHIFI PHARM OMPORT HORIA ROAD LIME BUILDING HARGEISA",
        "address2": " "
    },
    {
        "code": "1546",
        "address1": "SEEMA & CO VIA LUCIAN MANARMN /1/8 MILAN ITALY",
        "address2": " "
    },
    {
        "code": "1547",
        "address1": "SAINI SEEMA VIA LUCIAMO MARANA 1 BRESCIA",
        "address2": " "
    },
    {
        "code": "1548",
        "address1": "205 HIGH STREET, KINROSS KY 13 8DL,\r\nU.K.",
        "address2": " "
    },
    {
        "code": "1549",
        "address1": "39 THISTLECROSFT GARDENS STANMORE MIDDX",
        "address2": " "
    },
    {
        "code": "1550",
        "address1": "TRANSPORTATION H K LTD ROOM 2601 2603 26TH FLOOR SAXON TOWER 7 CHEUNG SHUN STREET CHEUNG S HONG KONG",
        "address2": " "
    },
    {
        "code": "1551",
        "address1": "VIETYEN VILLAGE DIEPNONG COMMUNE HUNG HA DISTRICT THAI BINH PROVINCE VIETNAM FACTORY CODE: 1001054955 CONTACT PERSON MS TRAN THI NHUNG (IM/EX DEPT) TEL: 0985 335 370",
        "address2": " "
    },
    {
        "code": "1552",
        "address1": "BUILDING NAME LOKN STORE MATFORD BUSINESS PARK MARSH BATON ROAD CITY EX2 8FD UK",
        "address2": " "
    },
    {
        "code": "1553",
        "address1": "4 HARPER STREET ROCHDALE OL 11 3RD LANCASHIRE UK MANCHESTER UK C/O AAA FREIGHT SERVICES LTD",
        "address2": " "
    },
    {
        "code": "1554",
        "address1": "HARPER STREET ROCHALE OL11 3RQ LANCASHIRE TELL NO. 00447446124778",
        "address2": " "
    },
    {
        "code": "1555",
        "address1": "C/O RELIANCE COMMERCIAL ASSOCIATES DAFZA INDUSTRIAL PARK QC-02 P.O BOX 54309 DUBAI",
        "address2": " "
    },
    {
        "code": "1556",
        "address1": "BUNSEN STR 6F 65203 WIESBADEN GERMANY",
        "address2": " "
    },
    {
        "code": "1557",
        "address1": "MOHAMMAD SHAHBAZ VIA GRANDE 13 42012 CAMPAGNOIA",
        "address2": " "
    },
    {
        "code": "1558",
        "address1": "IDEAL AFRICA SRL VIA GRAND 1342012 CAMPAGN OLA EMILIA",
        "address2": " "
    },
    {
        "code": "1559",
        "address1": "INDIAN OVERSEAS BANK SINGAPORE SG",
        "address2": " "
    },
    {
        "code": "1560",
        "address1": "SALWA ROAD QATAR NATIONAL BANK BUILDING DOHA QATAR OF QATAR P.O BOX 15241 TEL: 00974-33536916",
        "address2": " "
    },
    {
        "code": "1561",
        "address1": "WHITEHORN AVENUE MISSISS ONTA TORONTO   CANADA",
        "address2": " "
    },
    {
        "code": "1562",
        "address1": "371 SAVOLINE BLVD MII/TON ONTARIO L9T 7Y2 TORONTO CANADA",
        "address2": " "
    },
    {
        "code": "1563",
        "address1": "SAVOLINE BLVD CANADA",
        "address2": " "
    },
    {
        "code": "1564",
        "address1": "RIMFROSTGATAN 53 LGH 1101 418 40 COPENHAGEN DENMARK",
        "address2": " "
    },
    {
        "code": "1565",
        "address1": "WHOLESALE MARKET NOBEL WAY THE HUB WITON BIRMINGHAM B6 7EU UNITED",
        "address2": " "
    },
    {
        "code": "1566",
        "address1": "P O BOX NO 2365 JEDDAH KSA  TEL: 00966 504541366",
        "address2": " "
    },
    {
        "code": "1567",
        "address1": "ORG NR 926194089 ENEBAKKVEIEN 172 RYEN OSLO NORWAY NO 00447301 2291",
        "address2": " "
    },
    {
        "code": "1568",
        "address1": "FARMACEUTICO FASSI SPA VIA NAZIONAL SUD 3-18027 CHIUSANICO (IM) PARTITA IVA 02218540017",
        "address2": " "
    },
    {
        "code": "1569",
        "address1": "33 65931 FRANKFURT GERMANY",
        "address2": " "
    },
    {
        "code": "1570",
        "address1": "FRANKFRT 65931",
        "address2": " "
    },
    {
        "code": "1571",
        "address1": "4907 CALLAGHAN RD # 119 SAN ANTONIO TX 78228 USA",
        "address2": " "
    },
    {
        "code": "1572",
        "address1": "LOCAL OFFICE DHAKA 1000 BANGLADESH",
        "address2": " "
    },
    {
        "code": "1573",
        "address1": "JOHANNES VERHULSSTRAAT 163 1075 GX AMSTERDAM NEDERLAND TEL: +31 2030 80725",
        "address2": " "
    },
    {
        "code": "1574",
        "address1": "UNIT 162 THE MALL THE STRATF ORD CE LONDON E15 1XF",
        "address2": " "
    },
    {
        "code": "1575",
        "address1": "86 HOBS MOAT ROAD SOLIHUULL B92 C/O FORWARDING LINE LTD U.K  TEL: 02085648622",
        "address2": " "
    },
    {
        "code": "1576",
        "address1": "77 F PIA HOUSING SOCIETY LAHORE PAKISTAN PUNJAB",
        "address2": " "
    },
    {
        "code": "1577",
        "address1": "BEIJING BRANCH ADDRESS ROOM 1111 C&W PLAZA JIUXIANQIAO ROAD BUILDING53 NO 14 CHAOYANG DISTRICT BEIJING CHINA",
        "address2": " "
    },
    {
        "code": "1578",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1579",
        "address1": "S-20113 SOUTH ZONE JEBEL ALI FREE ZONE 61041 DUBAI U A E",
        "address2": " "
    },
    {
        "code": "1580",
        "address1": "BOX 82, 751 03 UPPSALA, SWEDEN \r\nTEL: NO 0046-18-421450",
        "address2": " "
    },
    {
        "code": "1581",
        "address1": "CO LLC  DUBAI UAE.",
        "address2": " "
    },
    {
        "code": "1582",
        "address1": "1A 12689 BERLIN",
        "address2": " "
    },
    {
        "code": "1583",
        "address1": "BIN SHEIKH HOLDING GRAND HAMAD STREET BUILDING NO 72 6TH FLOOR ROOM NO 607",
        "address2": " "
    },
    {
        "code": "1584",
        "address1": "UNIT 5/B, BEAVERS INDUSTRIAL ESTATE SOUTHALL UB3 5EB LONDON U.K",
        "address2": " "
    },
    {
        "code": "1585",
        "address1": "C/O S WHOLSALE UNIT 3 CROSSWAY PARK HITCHIN ROAD ARLESEY SG15 6SG UK TEL 0208 843 5628",
        "address2": " "
    },
    {
        "code": "1586",
        "address1": "378 CHEETHAM HILL ROAD MANCHESTER",
        "address2": " "
    },
    {
        "code": "1587",
        "address1": "VAT NO 3474112 MH PIZZERIA ABBEY STREET CAHIR CO TIPPERARY IRLAND E2 1XD45",
        "address2": " "
    },
    {
        "code": "1588",
        "address1": "125499 MOSCOW FLOTSKAYA STREET 54 4 NAM01022019 RUSSIA",
        "address2": " "
    },
    {
        "code": "1589",
        "address1": "ELTER STR 290312 D-48432 RHEINE GERMANY",
        "address2": " "
    },
    {
        "code": "1590",
        "address1": "RUE DU CHEVAKIER DE CLIEU FACE MAIRIE DE MARCORY BP 1305 ABIDJAN 01 COTE D VOIRE",
        "address2": " "
    },
    {
        "code": "1591",
        "address1": "VIA REDECSIO 5 C/O SKY FLY 20090 SEGRATE MILANO ITALY ATTN MRS MARIA POLIA MASTROIANNI OHN +39 3468423908",
        "address2": " "
    },
    {
        "code": "1592",
        "address1": "ARSALAN UMAR VIA PAVIA 42 20811 CESANO MADERNO",
        "address2": " "
    },
    {
        "code": "1593",
        "address1": "107 AVENUE DU ROI 1190 FOREST BELGIUM BE0713938905 BRUSSELS TEL: +32 478 99 45 85",
        "address2": " "
    },
    {
        "code": "1594",
        "address1": "C/O ABDUL KADIR AL FAREH HOTEL FRIJ MURAE P.O BOX NO 114602 DUBAI UAE",
        "address2": " "
    },
    {
        "code": "1595",
        "address1": "52 A HERBERT CHITEPO STREET MUTARE ZIMBABWE TEL: 2632063316",
        "address2": " "
    },
    {
        "code": "1596",
        "address1": "UNIT F5 ROCK BUSINESS PARK THE HOLLOW WASHINGTON WEST SUSSEX RH20 3GR UNITED KINGDOM",
        "address2": " "
    },
    {
        "code": "1597",
        "address1": "20-22 PIMLICO ROAD LONDON U K SW1W8LJ T: 207 730 5070",
        "address2": " "
    },
    {
        "code": "1598",
        "address1": "P.O BOX NO: 21584 MANAMA BAHRAIN",
        "address2": " "
    },
    {
        "code": "1599",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1600",
        "address1": "UNIT 16 BIRMINGHAM WHLOESALE MARKET THE HUB MOBEL WAY WITTON BIRMINGHAM B6 7EU MOB 7929150633",
        "address2": " "
    },
    {
        "code": "1601",
        "address1": "STAND 53 54 NEW SPITALFIELD MARKET LEYTON LONDON UK",
        "address2": " "
    },
    {
        "code": "1602",
        "address1": "RUA 3300 360 SALA 108C88 ZIP CODE 8833 272 CENTRO BALNEARIO CAMBORIU SC BRAZIL",
        "address2": " "
    },
    {
        "code": "1603",
        "address1": "M TRADING APS,\r\nKORNMARKSVEG 6 2605,\r\nBRONDBY DENMARK......",
        "address2": " "
    },
    {
        "code": "1604",
        "address1": "ARTEMIDOS STR 16 METAMORFOSI 144 52 ATHENS GREECE VAT NO EL094043759",
        "address2": " "
    },
    {
        "code": "1605",
        "address1": "VIA SERENISSIMA 5B-25135 BRESCIA (BS)  ITALY P. LVA",
        "address2": " "
    },
    {
        "code": "1606",
        "address1": "MALE MALDIVES COMPANY REG NO 14/35",
        "address2": " "
    },
    {
        "code": "1607",
        "address1": "5 RAFFLES AVENUE MARINA SQUARE 039797 SINGAPORE SG",
        "address2": " "
    },
    {
        "code": "1608",
        "address1": "# 52 ABIOKUTA EXPRESS WAY IKEJA LAGOS NIGERIA PHN 0102268842",
        "address2": " "
    },
    {
        "code": "1609",
        "address1": "FASANENWEG 7-9 TURN NUMBER 24 65451 KELSTERBACH GERMANY",
        "address2": " "
    },
    {
        "code": "1610",
        "address1": "7-A K MAIN BOULEVARD GULBERG II LAHORE 5400 PAKISTAN",
        "address2": " "
    },
    {
        "code": "1611",
        "address1": "FASANENWEG 7/9 65451 KIESTERBACH GERMANY",
        "address2": " "
    },
    {
        "code": "1612",
        "address1": "GMBH FASANENWEG 7/9 65451 KELSTERBACH GERMANY",
        "address2": " "
    },
    {
        "code": "1613",
        "address1": "COURNEUVE FRANCE, BRUSSLES, BELGIUM, 000000,BE,0000000",
        "address2": " "
    },
    {
        "code": "1614",
        "address1": "530 7TH AVENUE SUITE 1008 NEW YORK NY 10018 TEL: 212 869 3303 3296",
        "address2": " "
    },
    {
        "code": "1615",
        "address1": "245 MAIN ROAD DERWENT PARK CITY HOBART ABN 49651040283 MELBOURN AUSTRALIA 7009 AU 0061 1452367860",
        "address2": " "
    },
    {
        "code": "1616",
        "address1": "AZADY QR NEAR SALEH ZUHER MOSQUE KANI STREET ERBIL IRAQ EMAIL: AYUB.ZAZNAII@GMAIL.COM",
        "address2": "TEL: 009647504589988 "
    },
    {
        "code": "1617",
        "address1": "2013 GRACE ST. CULLODEN, WV  255 10-USA",
        "address2": " "
    },
    {
        "code": "1618",
        "address1": "3279 GRAND ISLAND BLVD, GRAND ISLAND NY, 14072, U.S.A 716-774-2700 716-774-2701",
        "address2": " "
    },
    {
        "code": "1619",
        "address1": "MIR TRADERS HK, 2/F I 41 HONG KONG",
        "address2": " "
    },
    {
        "code": "1620",
        "address1": "SEROPHARM DR LILIOU O JONATHAN ",
        "address2": "05 BP 6L 23 OUAGA PATTE D'OIE "
    },
    {
        "code": "1621",
        "address1": "OFFICE NO 01 BULD NO 224 STREET NO 230 ZONE 25 AL MANSOURA DOHA QATAR",
        "address2": " "
    },
    {
        "code": "1622",
        "address1": "(CONSULOR AGENT) MAKKAH AL SHAWQIYYAH AL MUHAMMADIA WALI AL AHAD HOUSE # 4222 MAKKAH AL MUKARRMA ZIP CODE 24353",
        "address2": " "
    },
    {
        "code": "1623",
        "address1": "C/O SHARMAKE HORIA ROAD LIEMO BUILDING HARGESIA SOMALIA",
        "address2": " "
    },
    {
        "code": "1624",
        "address1": "C/O MRS IRAJ MUNIR 1107 225 WEBB DRIVE MISSISSAUGA ONTARIO L5B4P2 POSTAL CODE CANADA",
        "address2": " "
    },
    {
        "code": "1625",
        "address1": "30 LGH 1101 BACKBV 72473 VASTRAS SWEDEN",
        "address2": " "
    },
    {
        "code": "1626",
        "address1": "UNIT 4 BUILDING 59 STREET 751 ZONE 71 UM SALL MUHAMMED QATAR",
        "address2": " "
    },
    {
        "code": "1627",
        "address1": "112 WEST 34TH STREET 17TH FLOOR SUITE 17071 NEW YORK",
        "address2": " "
    },
    {
        "code": "1628",
        "address1": "350 KING STREET WEST MELBOURNE VICT3003 TEL: 61-3-93297363",
        "address2": " "
    },
    {
        "code": "1629",
        "address1": "GLOBAL LOGISTICS BERLINER STR 115 40880 RATINGEN GERMANY TEL: +49 2102 94214 24 FAX +49 2102 94214 29",
        "address2": " "
    },
    {
        "code": "1630",
        "address1": "10200 CAMBIE ROAD RICHMOND V6X AK5",
        "address2": " "
    },
    {
        "code": "1631",
        "address1": "INHABER TAHIR AHMED FRONGARTEN STRASSE20 64572",
        "address2": " "
    },
    {
        "code": "1632",
        "address1": "22 3RD FLOOR MAIN CHAMBERS SHAHRAH  E LIAQUAT KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "1633",
        "address1": "VIA PRIMO LEVI 15 GRUGLIASCO TO ITALY",
        "address2": " "
    },
    {
        "code": "1634",
        "address1": "36 FIRTH ROAD, HOUSTON INDUSTRIAL ESTATE, LIVINGSTON, WEST LOTHIAN EH54 5DJ U.K.",
        "address2": " "
    },
    {
        "code": "1635",
        "address1": "MATERIAL HOSPITALAR LTDA RUA SOUZA DUTRA 145 88070 605 FLOORIANOPOLLIS SC BRASIL CNPJ 40 937 745 0001 04 FONE 48 300000000",
        "address2": " "
    },
    {
        "code": "1636",
        "address1": "No. 8, CHANGI SOUTH LANE, #03-01,\r\nSINGAPORE.486113. PH#: 65-97385172\r\n",
        "address2": " "
    },
    {
        "code": "1637",
        "address1": "P.O BOX NO 13281",
        "address2": " "
    },
    {
        "code": "1638",
        "address1": "UNIT 11 16/F PROFIT INDUSTRIAL BUILDING NOS. 1-15 KWAI FUNG CRESCENT KWAI CHUNG N.T HK TEL: 852 25417768",
        "address2": " "
    },
    {
        "code": "1639",
        "address1": "360 CHE GUEVARA ROAD GLENWOOD DURBAN 4001 SOUTH AFRICA",
        "address2": " "
    },
    {
        "code": "1640",
        "address1": "UNIT 2B REAR OF TAPI CARPETS COLNE VALLEY RETAIL PARK LOWER HIGH STREET WATFORD",
        "address2": " "
    },
    {
        "code": "1641",
        "address1": "9 GREYFELL CLOSE STANMORE MIDDX LONDON HA7 3DQ UNITED KINGDOM ",
        "address2": "TEL: +44 7813 333035 VAT GB 267 4777 53 "
    },
    {
        "code": "1642",
        "address1": "FOR GENERAL TRADING AL MIRQAB BLOCK 2 BUILDING NO 15 GROUND FLOOR ABDULLAH AL MUBARAK STREET KUWAIT CITY",
        "address2": " "
    },
    {
        "code": "1643",
        "address1": "AL SATWA ROAD SHOP 08 SHIKHA FATIMA BLDG DUBAI UAE",
        "address2": " "
    },
    {
        "code": "1644",
        "address1": "PAPLU FRESH VEG.UNIT.27 BOW TRIANGLE BUSINESS CENTER ELEANOR STREET LONDON (U.K).E3 4UR C/O: AIRPORT CARGO SERVICES CODE NO (DRA)",
        "address2": " "
    },
    {
        "code": "1645",
        "address1": "PEMCO CONVERSIONS 4420 WESTSHORE BLVD TAMPA FL 33614 USA PH 813 322 9600 EXT 9640",
        "address2": " "
    },
    {
        "code": "1646",
        "address1": "CORPORATION BANKING DIVISION",
        "address2": " "
    },
    {
        "code": "1647",
        "address1": "UNIT 3 MANCHESTER UK MANCHESTER M124AS GB TL +44 7534 162728",
        "address2": " "
    },
    {
        "code": "1648",
        "address1": "CALLE DESIDERIO VALVERDE # 103 ZONA UNIVERSITARIA SANTO DOMINGO",
        "address2": " "
    },
    {
        "code": "1649",
        "address1": "NO 19 MARLARMYINE STREET THAKETA INDUSTRIAL THAKETA TOWNSHIP YANGON MYNMAR",
        "address2": " "
    },
    {
        "code": "1650",
        "address1": "ZAC DU GRAND LAUNARY AVENUE VICTOR GRIGNARD 76120 LE GRANDQUEVILLY FRANCE",
        "address2": " "
    },
    {
        "code": "1651",
        "address1": "AVENUE VICTOR GRIGNARD 76120 LE GRAND QUEVILLY FRANCE",
        "address2": " "
    },
    {
        "code": "1652",
        "address1": "B24 CHALLINOR TERRACE NILION NATARIO L9T 7V6 CANADA",
        "address2": " "
    },
    {
        "code": "1653",
        "address1": "TORONTO CANADA",
        "address2": " "
    },
    {
        "code": "1654",
        "address1": "41/43 UNION STREET ACCRIGTON 1PL MOB 0744 7908795 WWW PRIME BAZAR UK",
        "address2": " "
    },
    {
        "code": "1655",
        "address1": "HASAN NENANDROY 15-17 KASHMIR,\r\nMINI MARKET P.O BOX 10552,\r\nATHENS GREECE...",
        "address2": " "
    },
    {
        "code": "1656",
        "address1": "UNIT 14 ST JAMES WHOLE SALE MARKET FORDFORD BD4 7PN MANCHESTER UK",
        "address2": " "
    },
    {
        "code": "1657",
        "address1": "77 HIGH STRRET # 04-06 HIGH STREET PLAZA SINGAPORE 179433",
        "address2": " "
    },
    {
        "code": "1658",
        "address1": "KUWAIT",
        "address2": " "
    },
    {
        "code": "1659",
        "address1": "TRADING CO EST KUWAIT",
        "address2": " "
    },
    {
        "code": "1660",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1661",
        "address1": "35 KOFO ABAYOML STREET APAPA LAGOS NIGERIA TEL: 08063060891,08023762382",
        "address2": " "
    },
    {
        "code": "1662",
        "address1": "294 CHERRY WOOD ROAD UNIT 7 BIRMINGHAM B9 FU C/O AIRPORT CARGO LTD",
        "address2": " "
    },
    {
        "code": "1663",
        "address1": "65 A GALLE ROAD DEHLWALA NORTH SRI LANKA",
        "address2": " "
    },
    {
        "code": "1664",
        "address1": "NEW AL GHANIM SALWA ROAD 340 ZONE 55 BUILDING NO 488 QATAR",
        "address2": " "
    },
    {
        "code": "1665",
        "address1": "A L L NEW AL GHANIM SALWA ROAD 340 ZONE 55 BUILDING NO 488 QATAR",
        "address2": " "
    },
    {
        "code": "1666",
        "address1": "UNIT 39-40 TRENT SOUTH  INDUSTRIAL ESTATE NOTTINGHAM",
        "address2": " "
    },
    {
        "code": "1667",
        "address1": "8032 LEESBURG PIKE TYSONS CORNER VA 22182",
        "address2": " "
    },
    {
        "code": "1668",
        "address1": "TURIZM KUYUMCULUK SAN VE TIC LTD STI OSMANIYE MAH FILDAMI SOKAK NO 34 /B BAKIRKOY ISTANBUL TURKEY",
        "address2": " "
    },
    {
        "code": "1669",
        "address1": "C/O TRODEVIN LTD PEOPLESHARAM PEOPLE S PHARM KINGGSTOWN ST VINCENT",
        "address2": " "
    },
    {
        "code": "1670",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1671",
        "address1": "AB C/O ASIAN FOOD CENTRE FITTAVAGEN 3 S-14551 NORSBORG STOCKHOLM",
        "address2": " "
    },
    {
        "code": "1672",
        "address1": "SMITHFIELD WHITWORH STREET EAST MANCHESTER  M 11 2WJ U.K",
        "address2": " "
    },
    {
        "code": "1673",
        "address1": "15 GARTSIDE STREET OLDHAM OL4 GREATER MANCHESTER",
        "address2": " "
    },
    {
        "code": "1674",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1675",
        "address1": "TRADE SERVICES NO:110, SIR JAMES PEIRIS\r\nMW, COLOMBO 02,POST CODE 00200, \r\nSRILANKA",
        "address2": " "
    },
    {
        "code": "1676",
        "address1": "STALL NO A-1 NEW SMITHFIED MARKET",
        "address2": " "
    },
    {
        "code": "1677",
        "address1": "% ONE WOLRD VIA UMBRIA 27/C 10099 SAN MAURO TORINESE (TO) ITALY",
        "address2": " "
    },
    {
        "code": "1678",
        "address1": "MANCHENER STR 8 60329 FRANKFURT GERMANY",
        "address2": " "
    },
    {
        "code": "1679",
        "address1": "NO 1 35 JALAN PRIMA SG2 68100 BATU CAVES SELANGOR MALAYSIA",
        "address2": " "
    },
    {
        "code": "1680",
        "address1": "C/O SHARMARKET HORI A ROAD LIEMO BUILDING HARGESIA",
        "address2": " "
    },
    {
        "code": "1681",
        "address1": "354 WATERLOO ROAD MANCHESTER, GREAT BRITAIN, M8 9AB , GB, 07438184 (09",
        "address2": " "
    },
    {
        "code": "1682",
        "address1": "UNIT 5 MILL STREET B6 4BS UK",
        "address2": " "
    },
    {
        "code": "1683",
        "address1": "148/1 KYNSY ROAD COLOMBO 08 SRILANKA",
        "address2": " "
    },
    {
        "code": "1684",
        "address1": "1104 10 ENIGHTSERIDGE RD BRAMPTON ONTARIO CANADA L6T 5L6  TEL: 001 647 7418080",
        "address2": " "
    },
    {
        "code": "1685",
        "address1": "LONDON U.K EMENUAL FREIGHT SERVICES",
        "address2": " "
    },
    {
        "code": "1686",
        "address1": "MATRIX BUSINESS CENTRE HIGHVIEW HOUSE 167 STATION ROAD EDGWARE HA8 7JU",
        "address2": " "
    },
    {
        "code": "1687",
        "address1": "OSLO NORWAY.....",
        "address2": " "
    },
    {
        "code": "1688",
        "address1": "REISE AS OLE REISTADS VIE 3, 1068 OSLO NORWAY",
        "address2": " "
    },
    {
        "code": "1689",
        "address1": "REISETADS VEI 3 1068 OSLO NORWAY",
        "address2": " "
    },
    {
        "code": "1690",
        "address1": "OSLO NORWAY",
        "address2": " "
    },
    {
        "code": "1691",
        "address1": "REISE AS OLE REISTADS VEI 3 1068 OSLO  TEL 0098 77668866",
        "address2": " "
    },
    {
        "code": "1692",
        "address1": "EXPORTACAO EIRELI CNPJ 08 164 116/0001-78 AV GETULIO VARGAS 162 SALA 22 VILLA OPERARIA ZIP CODE: 88 303 220 ITAJAI SC BRAZIL",
        "address2": " "
    },
    {
        "code": "1693",
        "address1": "C/O NAS AERO LTD 1826 BICKFORD AVE SNOHOMISH WA 98290 USA CONTACT JONATHAN D HOWARD TEL: +1 425 760 6705",
        "address2": " "
    },
    {
        "code": "1694",
        "address1": "DOHA QATAR",
        "address2": " "
    },
    {
        "code": "1695",
        "address1": "SOUVINER TRADING &CO. DOHA QATAR",
        "address2": " "
    },
    {
        "code": "1696",
        "address1": "KOENIGSSTRASSE 21 INTL BUSINESS KEMPTEN GERMANY",
        "address2": " "
    },
    {
        "code": "1697",
        "address1": "INTERNATIONAL GESCHAFT RESIDENZPLATZ 23 87435 KEMPTEN GERMANY",
        "address2": " "
    },
    {
        "code": "1698",
        "address1": "UNIT 31-33 ST JAMES MARKET ESSEX STREET BRADFORD WEST YORKSHIRE BD4 7PN U.K.",
        "address2": " "
    },
    {
        "code": "1699",
        "address1": "76.166.489-1 CAMINO EL ALBA 8760 OFICINA CONTACTO KARLA OSORIO",
        "address2": " "
    },
    {
        "code": "1700",
        "address1": "ATTN:URS MEIER 8058 ZURICH AIRPORT",
        "address2": " "
    },
    {
        "code": "1701",
        "address1": "44147 DORTMUND DEUTSCHLAND FRANKFURT GERMANY",
        "address2": " "
    },
    {
        "code": "1702",
        "address1": "B96457288 AVDA HNS MARISTAS NO 28",
        "address2": " "
    },
    {
        "code": "1703",
        "address1": "MUHAMMAD BABAR IQBAL MAURENER WG 80 71034 BOBLINGEN GERMANY",
        "address2": " "
    },
    {
        "code": "1704",
        "address1": "STOCKHOLM SWEDEN",
        "address2": " "
    },
    {
        "code": "1705",
        "address1": "KIHLGRENS VAG 119279 MARSTA STOCKHOLM SWEDEN",
        "address2": " "
    },
    {
        "code": "1706",
        "address1": "CH EPAR CD MEGARACH ALEPOCHORIOUS 10100 OT666 GREECE TEL: 00300 2296401028",
        "address2": " "
    },
    {
        "code": "1707",
        "address1": "SAFAT (KUWAIT)",
        "address2": " "
    },
    {
        "code": "1708",
        "address1": "SUNSHINE HOUSE ALBERT STREET\r\nWEDNESBURY, WEST MIDLANDS, WS10 7EW",
        "address2": " "
    },
    {
        "code": "1709",
        "address1": "UNIT 3/4 GARRISON STREET BORDEDLY GREEN BIRMINGHAM  B9 4 DG MANC HESTER GREAT BRITIAN B94DG",
        "address2": " "
    },
    {
        "code": "1710",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1711",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1712",
        "address1": "POST BOX VF 509 FORT VIEUX ST LUCIA WEST INDIES",
        "address2": " "
    },
    {
        "code": "1713",
        "address1": "PO RONGARTENSTER 20 FRANKFURT GERMANY",
        "address2": " "
    },
    {
        "code": "1714",
        "address1": "801 8F ACE TWIN TOWER IST 212-1 GURO DONG GURO GU SEOUL 152 050 REPUBLIC KOREA",
        "address2": " "
    },
    {
        "code": "1715",
        "address1": "OSLO, NORWAY",
        "address2": " "
    },
    {
        "code": "1716",
        "address1": "OSLO NORWAY",
        "address2": " "
    },
    {
        "code": "1717",
        "address1": "AND TECHNICAL WLL PO BOX 18438 DOHA QATAR",
        "address2": " "
    },
    {
        "code": "1718",
        "address1": "4/F KAM FUNG COMMERCIAL BLDG 2-4 TIN LOK LANE HONG KONG",
        "address2": " "
    },
    {
        "code": "1719",
        "address1": "ZONE NO 56 STREET 340 BLDG 299 RETAJ BLDG GATE A6 2ND FLOOR DOH",
        "address2": " "
    },
    {
        "code": "1720",
        "address1": "SABIHA GOKCEN HAVALIMANI E KAPISI HABOM KARGO YOLU TEL: +902124636363",
        "address2": " "
    },
    {
        "code": "1721",
        "address1": "MULAMMAAGE FAREEDHEE MAGA MALE",
        "address2": " "
    },
    {
        "code": "1722",
        "address1": "COCODY CIT DES ATRS RUE IMPASSE DES POETES VILLA 13 TEL: 0707702785 ABIDJAN",
        "address2": " "
    },
    {
        "code": "1723",
        "address1": "BUILDING NO 158 OLD AIRPORT ROAD DOHA QATAR",
        "address2": " "
    },
    {
        "code": "1724",
        "address1": "BERGENGATAN 49 LGH 1006 16437 KISTA STOCKHOLM",
        "address2": " "
    },
    {
        "code": "1725",
        "address1": "STRET HAM HILL SW2 3AA LONDON UK",
        "address2": " "
    },
    {
        "code": "1726",
        "address1": "12 40227 DUSSELDORF GERMANY",
        "address2": " "
    },
    {
        "code": "1727",
        "address1": "ERIK NOLTING ST 12 DUSSELDORF FRANKFURT",
        "address2": " "
    },
    {
        "code": "1728",
        "address1": "48 SOUTH FRANKLIN TURNPIKE, SUIT 202 RAMSEY, NEW TERSEY 07446 ATTN: AIR IMPORT DEPT. TEL: 201-316-1600 FAX: 201-995-9980",
        "address2": " "
    },
    {
        "code": "1729",
        "address1": "NIEUWE HEUWE HEMWEG 7K AMSTERDAM 1013 NL",
        "address2": " "
    },
    {
        "code": "1730",
        "address1": "HYBRIDEWEG 189 2141 D.M VIJFHUIZEN THE NETHERLANDS",
        "address2": " "
    },
    {
        "code": "1731",
        "address1": "STREET 860 ZONE 17 DOHA QATAR",
        "address2": " "
    },
    {
        "code": "1732",
        "address1": "SABIHA GOKCEN INT'L AIRPORT (SAW) GATE E 34912 PENDIK / ISTANBUL TURKEY",
        "address2": " "
    },
    {
        "code": "1733",
        "address1": "ATATURK INT'L AIRPORT GATE B 34149 YESILKOY ISTANBUL TURKIYE TEL: +90 212 4636363",
        "address2": " "
    },
    {
        "code": "1734",
        "address1": "TEVLINGVEIEN 23 1081 OSLO NORWAY",
        "address2": " "
    },
    {
        "code": "1735",
        "address1": "ST EAST DUBLIN 7 IRELAND",
        "address2": " "
    },
    {
        "code": "1736",
        "address1": "G-21-23 WELKIN MILL WELKIN ROAD BREDBURY STOCK PORT SK6 2BH UK",
        "address2": " "
    },
    {
        "code": "1737",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1738",
        "address1": "SALZKOTTEN EG MRS TAMARA SCHOLLE MARKET 15 33154 SALZKOTTEN GERMANY",
        "address2": " "
    },
    {
        "code": "1739",
        "address1": "GOLDEN BUSINESS PARK ORIENT WAY LAYTON LONDON-E-10 7FE UNITED KINGDOM TEL: 020 8988 1100",
        "address2": " "
    },
    {
        "code": "1740",
        "address1": "WICHMANNVEGEN 3 5420 RUBBESTADNESET",
        "address2": " "
    },
    {
        "code": "1741",
        "address1": "S.A.S DI ISLAM SHARIFUL VIA LA MARMORA 130 BRESCIA PARTITA IVA 0360420981",
        "address2": " "
    },
    {
        "code": "1742",
        "address1": "C/O FONDATION GRAND COEUR BP 1105 NDJAMENA CHAD",
        "address2": " "
    },
    {
        "code": "1743",
        "address1": "47 BECKET ROAD WORKING BN14 7EY LONDON UNITED KINGDOM",
        "address2": " "
    },
    {
        "code": "1744",
        "address1": "GONGJU-SI CHUNG CHEONGNAM DO405DONG401HO SOUTH KOREA",
        "address2": " "
    },
    {
        "code": "1745",
        "address1": "MURENA 26/28 ROME ITALY",
        "address2": " "
    },
    {
        "code": "1746",
        "address1": "C/O S DEAN THE PEOPLES PHARM THE PEKLINGSTON ST VINCENT",
        "address2": " "
    },
    {
        "code": "1747",
        "address1": "16 MOUNTAIN ROAD CLOGHUGE NEWRY DOWN BT35 8NJ UNITED KINGDOM",
        "address2": " "
    },
    {
        "code": "1748",
        "address1": "10813, NW 30 STEET SUITE 115 DORAL\r\nFLORIDA",
        "address2": " "
    },
    {
        "code": "1749",
        "address1": "6241 RANDOLPH ST COMMERCE CA 90040 USA TEL: 323-516-6771",
        "address2": " "
    },
    {
        "code": "1750",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1751",
        "address1": "401 WEST, ARTESIA BLVD, COMPTON,",
        "address2": "CALIFORNIA 90220, USA. "
    },
    {
        "code": "1752",
        "address1": "ISTANBUL TURKEY ",
        "address2": " "
    },
    {
        "code": "1753",
        "address1": "13TH FLOOR BAHRIA TOWN TOWER,TARIQ ROAD, KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "1754",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1755",
        "address1": "SOCIAL SECURITY STREET NR JAMIA MAKKI MASJID",
        "address2": " "
    },
    {
        "code": "1756",
        "address1": "RUA DOUTOR PEDRO RANGEL",
        "address2": " "
    },
    {
        "code": "1757",
        "address1": "Unit no 1702 - 325 WEBB Drive, Mississauga,",
        "address2": "ON L5B 3Z9, Canada Contact No 647-282-0852 Contact Person Umer Jamil"
    },
    {
        "code": "1758",
        "address1": "NORBYGATA 15 0187 OSLO NORWAY 0187",
        "address2": " "
    },
    {
        "code": "1759",
        "address1": "4175 BLUEBONNET DRIVE STAFFORD ",
        "address2": " "
    },
    {
        "code": "1760",
        "address1": "68 71 GALAXY AVENUE LINBRO BUSINESS PARK FRANKENWALD",
        "address2": " "
    },
    {
        "code": "1761",
        "address1": "UNIT 8 MIRABEL INDUSTRIAL ESTATE 276 MAPLE STREET POMONA 1620 SOUTH",
        "address2": " "
    },
    {
        "code": "1762",
        "address1": "UNIT 2505,NO.166,TAPU EAST ROAD,",
        "address2": "SIMING DISTRICT XIAMEN CHINA "
    },
    {
        "code": "1763",
        "address1": "119 MAPODAERO MAPO GU SEOUL SOUTH KOREA",
        "address2": " "
    },
    {
        "code": "1764",
        "address1": "No.398 BEICUN RD，ZHELIN TOWN ,FENGXIAN DISTRICT，201416 SHANGHAI ,CHINA",
        "address2": " "
    },
    {
        "code": "1765",
        "address1": "UNIT 4 & 5 HS PARK, 130 DEMOCRACY",
        "address2": "WAY MARCONI BEAM CAPE TOWN,SOUTH AFRICA "
    },
    {
        "code": "1766",
        "address1": "DREW ROAD 1935 UNIT NO 11 MISSISSAGA ONT L5A LM7 TORONTO",
        "address2": " "
    },
    {
        "code": "1767",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1768",
        "address1": "28A STOKE POGES LANE SLOUGH LONDON SL1 3PQ",
        "address2": " "
    },
    {
        "code": "1769",
        "address1": "PLOT # LX-5, SCHEME 3 & 4, LANDHI",
        "address2": "INDUSTRIAL AREA, KARACHI, PAKISTAN "
    },
    {
        "code": "1770",
        "address1": "HABIB METROPOLITAN BANK LIMITED",
        "address2": "MAIN BRANCH, KARACHI-PAKISTAN "
    },
    {
        "code": "1771",
        "address1": "C/PLA DE VIDRERES, S/N 17411 - VIDRERES SPAIN",
        "address2": " "
    },
    {
        "code": "1772",
        "address1": "555 GELLHORN DRIVE HOUSTON, TX 77029",
        "address2": "PH: 713.672.0515 NEW EXT # 2008 "
    },
    {
        "code": "1773",
        "address1": "D-153-A-Pathan Colony, S.I.T.E,",
        "address2": "Karachi-Pakistan. "
    },
    {
        "code": "1774",
        "address1": "PLOT NO 9, Ist FLOOR, SECTOR 12-D",
        "address2": "NORTH KARACHI , KARACHI PAKISTAN "
    },
    {
        "code": "1775",
        "address1": "347 5TH AVENUE SUIT 1504,",
        "address2": "NEW YORK , NY 10016 USA "
    },
    {
        "code": "1776",
        "address1": "242 OLD NEW BRUNSWICK RD STE 145",
        "address2": "PISCATAWAY NJ 08854-3999 TEL: 732-515-9040 FAX:732-856-5008"
    },
    {
        "code": "1777",
        "address1": "6241 RANDOLPH STREET COMMERCE,",
        "address2": "CA 90040, USA "
    },
    {
        "code": "1778",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1779",
        "address1": "48 S. FRANKLIN TURNPIKE SUITE 202",
        "address2": "RAMSEY NJ 07446 TEL: 201-316-1600 EMAIL: DOCUMENTS@TRANSMODAL.NET"
    },
    {
        "code": "1780",
        "address1": "800 THIRD AVE., SUITE 2303,",
        "address2": "NEW YORK NY 10022, USA. TEL: 212-593-0606 FAX: 212-888-3859"
    },
    {
        "code": "1781",
        "address1": "STREET GRENZSTASSE 1 DRESDEN 01109 GERMANY",
        "address2": " "
    },
    {
        "code": "1782",
        "address1": "NO 2222A MEIPU VILLAGE WENCHUAN ROAD 2256 ",
        "address2": " "
    },
    {
        "code": "1783",
        "address1": "KULLUWAL ROAD GOHAD PUR 51310 S SILAKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "1784",
        "address1": "HAUPTSTRASSE 251 D 66128 SAARBRUCKEN GERMANY",
        "address2": " "
    },
    {
        "code": "1785",
        "address1": "HESSENRING 4A 64546 MOERFELDENWALLDORF GERMANY",
        "address2": " "
    },
    {
        "code": "1786",
        "address1": "RAZA PARTITA IVA 01379070327",
        "address2": " "
    },
    {
        "code": "1787",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1788",
        "address1": "142 SOI LATPHRAO 80 (CHANTIMA) LATPHRAO ROAD, KHWANG WANGTHONGLANG, KHET WANGTHONGLANG, BANGKOK 10310, THAILAND.",
        "address2": " "
    },
    {
        "code": "1789",
        "address1": "C/O MARAKISH EXPRESS CARGO LLC P O BOX 293004 JEBEL ALI FROZEN SOUTH JAFZA",
        "address2": " "
    },
    {
        "code": "1790",
        "address1": "TUFAIL SHAHEED ROAD, SAHIWAL",
        "address2": " "
    },
    {
        "code": "1791",
        "address1": "28-KM, SHEIKHPURA ROAD,",
        "address2": "KHURRIANWALA, FAISALABAD, 38000 PAKISTAN. "
    },
    {
        "code": "1792",
        "address1": "NIT: 890.910.452-1 TRANSV 14 NRO 45-124",
        "address2": "MEDELLIN COLOMBIA. "
    },
    {
        "code": "1793",
        "address1": "KARATASOU 7 ,54626 ,THESSALONIKI",
        "address2": "PIC: 'vicky.melissi@gr.wtogroup.com' "
    },
    {
        "code": "1794",
        "address1": "NIT : 830.008.524-5 COD ACI 054",
        "address2": "CARRERA 54 # 5 C 33 TEL:(+571)6505555 EXT. 1171 BOGOTACOLOMBIA"
    },
    {
        "code": "1795",
        "address1": "NO.189B7, NGUYEN VAN HUONG ST, THAO DIEN WARD, THU DUC CITY. HCMC VIETNAM",
        "address2": " "
    },
    {
        "code": "1796",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1797",
        "address1": "RAMTALI, RAILWAY ROAD NEAR QAUMI SCHOOL, SIALKOT",
        "address2": " "
    },
    {
        "code": "1798",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1799",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1800",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1801",
        "address1": "ZUOQIAO YOUXI TOWN,LINHAI CITY, ZHEJIANG, CHINA",
        "address2": " "
    },
    {
        "code": "1802",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1803",
        "address1": "SOKOLAC BB 70270 SIPAVA BOSNIA AND HERZEGOVINA",
        "address2": " "
    },
    {
        "code": "1804",
        "address1": "1-KM JARANWALA ROAD, KHURRIANWALA ",
        "address2": "FAISALABAD, PAKISTAN "
    },
    {
        "code": "1805",
        "address1": "PLOT # 9.2, ST-13/1, SECTOR 6-B, NORTH KARACHI INDUSTRIAL AREA, KARACHI",
        "address2": " "
    },
    {
        "code": "1806",
        "address1": "27TH FLOOR, OCEAN MALL, BLOCK-9, PLOT NO G-3, CLIFTON KARACHI",
        "address2": " POC"
    },
    {
        "code": "1807",
        "address1": "BS-1 2ND FLOOR F.B AREA BLOCK 16 KARACHI",
        "address2": " "
    },
    {
        "code": "1808",
        "address1": "10-A BLOCK-L FEROZEPUR ROAD GULBERG III",
        "address2": " POC"
    },
    {
        "code": "1809",
        "address1": "HOUSE NO R-1019, BLOCK-17., F.B AREA., KARACHI CENTRAL GULBERG TOWN",
        "address2": " POC"
    },
    {
        "code": "1810",
        "address1": "FACTORY-A/39-B,SITE IND AREA,,MANGOPHIR ROAD,KARACHI WEST",
        "address2": " "
    },
    {
        "code": "1811",
        "address1": "",
        "address2": " "
    },
    {
        "code": "1812",
        "address1": "AAMIR TRADE CENTER. SUITE 405, 4TH FLOOR, 233/1-A, BLOCK-2, PECHS, KARACHI",
        "address2": " "
    },
    {
        "code": "12010118",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010119",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010120",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010121",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010122",
        "address1": "SHAHDARA BUND ROAD NEAR JEHANGIR TOMB LAHORE PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010123",
        "address1": "MR AZRAB KHAN TORBRAM ROAD UNIT 4 MISSISSAUGA ON 64T 1H2 CANADA",
        "address2": " "
    },
    {
        "code": "12010124",
        "address1": "PLOT # C-11/A, SITE, KARACHI CU-00633",
        "address2": "D 25 BLOCK 6 F B AREA "
    },
    {
        "code": "12010125",
        "address1": "66 MOO 8 , NONGBUA-NOI, CC-00884",
        "address2": "SIKHIO, 30314 RATCHASIMA THAILAND "
    },
    {
        "code": "12010126",
        "address1": "ROOM 802 FUDI SQAURE NANHU AREA JIAXING ZHEJIANG,CHINA",
        "address2": " "
    },
    {
        "code": "12010127",
        "address1": "CARRERA NO.8,NO.11-23 CALI,COLOMBIA,",
        "address2": "NIT.NO,800,138,082-1 TEL:(57) 24857373 FAX:(57) 2 8890191"
    },
    {
        "code": "12010128",
        "address1": "STREET NO 4, MUHAMMAD PURA, PASRUR, SIALKOT, PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010129",
        "address1": "24TH FL., B-PINE AVENUE BLDG., EULJI STREET 100, JUNG-GU, SEOUL,KOREA",
        "address2": " "
    },
    {
        "code": "12010130",
        "address1": "KK BUILDING, BANO BAZAR, SIALKOT, PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010131",
        "address1": "OFFICE, KASHMIR ROAD PAKISTAN,PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010132",
        "address1": "ADDRESS : D-137/C S.I.T.E., KARACHI - PAKISTAN ",
        "address2": " "
    },
    {
        "code": "12010133",
        "address1": "BULIDING 1-1 OF HONGMIAN,SHIXIA VILLAGE,XINTANG TOWN,ZENGCHENG ZONE,GUANGZHOU CITY,GUANGDONG,CHINA",
        "address2": " "
    },
    {
        "code": "12010134",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010135",
        "address1": "376-3 NISHIMACHL CHOFU TOKYO  182 0032 JAPAN",
        "address2": " "
    },
    {
        "code": "12010136",
        "address1": "VIA G. P. CLERICI,2.GERENZANO (VA) 21040 Israel (IL)",
        "address2": " "
    },
    {
        "code": "12010137",
        "address1": "Kemp House, 128 City Road, London, United Kingdom, EC1V 2NX",
        "address2": " "
    },
    {
        "code": "12010138",
        "address1": "1000 NORTHBROOK PARKWAY, SUITE # D",
        "address2": "SUWANEE, GA, 30024, USA info@gosaint.com/ 678.937.1640"
    },
    {
        "code": "CU-00647",
        "address1": "PIA HEAD OFFICE BUIL PIA BUILDING KARACHI",
        "address2": " "
    },
    {
        "code": "CU-00013",
        "address1": "2/1, SECTOR 15, KORANGI INDUSTRIAL AREA, KARACHI-74900",
        "address2": " "
    },
    {
        "code": "CU-00721",
        "address1": "MOHALLA SHUJABAD ZAFERWL ROAD SIALKOT",
        "address2": " "
    },
    {
        "code": "CU-00902",
        "address1": "Plot NO. L-4/A-2, Block -22, FB Area, Karachi Central Gulberg Town",
        "address2": " "
    },
    {
        "code": "CU-00146",
        "address1": "",
        "address2": " "
    },
    {
        "code": "CC-11914",
        "address1": "SF UNIT # 32, HUB RIVER ROAD, S.I.T.E., KARACHI, Karachi West",
        "address2": " "
    },
    {
        "code": "12010139",
        "address1": "ROAD 19/47 NIHAL CHAND STREET SIALKOT PAKISTAN 19/47 SIALKOT PUNJAB",
        "address2": " "
    },
    {
        "code": "12010140",
        "address1": "CNPJ 31.615.514/001-85 ROD JOSE CARLOS DAUX N 8600 SALA 08-JOAO PAULO FLORIANOPLIS",
        "address2": " "
    },
    {
        "code": "12010141",
        "address1": "6625 Tomken Road, Unit 22-23, Mississauga, ON, ",
        "address2": "L5T 2C2 Canada.ontario@utopiafulfillment.com parmeet@utopiafulfillment.com Phone: (437)214-1586"
    },
    {
        "code": "12010142",
        "address1": "K. BAKKALKOY MAH SEVDA SOK SEVEN TOWER NO 1 K 3 ATASEHIR/ISTANBUL",
        "address2": " "
    },
    {
        "code": "12010143",
        "address1": "PLOT # 220-227 COMILLA EXPORT PROCESSING ZONE COMILLA POSTAL CODE 3500 BNAGLADESH",
        "address2": " "
    },
    {
        "code": "12010144",
        "address1": "Noul, Wazirabad Road, Sialkot 51310, Pakistan",
        "address2": "Ph # 0092-52-3553122, 3559333-4 & Fax # 0092-52-3554813 "
    },
    {
        "code": "12010145",
        "address1": "SORKER SAPEUS 2 AFM 1384072 ATHENS GREECE",
        "address2": " "
    },
    {
        "code": "12010146",
        "address1": "188 MITCHAM ROAD LAND SW17 9NT ",
        "address2": " "
    },
    {
        "code": "12010147",
        "address1": "15TH RIVER ROAD,LIAOXIA VILLAGE,WANGNIUDUN TOWN,DONGGUAN CITY,",
        "address2": "GUANGDONG,CHINA (MAINLAND) "
    },
    {
        "code": "12010148",
        "address1": "STORGATA 37,",
        "address2": "0182 OSLO, NORWAY. "
    },
    {
        "code": "12010149",
        "address1": "HOUSE NO. 26G/2  4TH GIZRI LANE OFF 5 GIZRI ST PHASE 4 DHA KARACHI ",
        "address2": " "
    },
    {
        "code": "12010150",
        "address1": "BRGY. BUGNAY JORDAN GUIMARAS ILO ILO CITY MANILA PHILIPPINES",
        "address2": " "
    },
    {
        "code": "12010151",
        "address1": "Ittefaq House # 369/D-2 Johar Town, ",
        "address2": "Lahore 54782, Pakistan. Tel: 92-42-35211692~ 3 Fax: 92-42-35401692"
    },
    {
        "code": "12010152",
        "address1": "62, BEOMBANG 2-RO, GANGSEO-GU,",
        "address2": "BUSAN, KOREA. "
    },
    {
        "code": "12010153",
        "address1": "DHL GLOBAL FORWARDING ZONA FRANCA RIONEGRO",
        "address2": "BODEGA 233-234 NIT 830.025.224-2 RIONEGRO, ANTIOQUIA, COLOMBIA  CARGA EN DTA"
    },
    {
        "code": "12010154",
        "address1": "AIR PORT ROAD KAUR PUR P O BOX 644 51310 SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010155",
        "address1": "SOCIEDAD ANONIMA CURIALES 1530 BIS MONTEVIDEO URUGUAY",
        "address2": " "
    },
    {
        "code": "12010156",
        "address1": "708 GINESI DRIVE MORGANVILLE NJ 07751 USA",
        "address2": " "
    },
    {
        "code": "12010157",
        "address1": "UNIT 1107-1109, 11/F, GLOBAL GATEWAY TOWER,",
        "address2": "NO.63 WING HONG STREET, CHEUNG SHA WAN, KOWLOON, HONG KONG "
    },
    {
        "code": "12010158",
        "address1": "TANGXI INDUSTRIAL ZONE LUOJIANG DISTRICT QUANZHOU FUJIAN CHINA,0086-595-28980396",
        "address2": " "
    },
    {
        "code": "12010159",
        "address1": "S.I.T.E.-II, BRANCH,",
        "address2": "KARACHI PAKISTAN. "
    },
    {
        "code": "12010160",
        "address1": "JEBEL ALI FREE ZONE,PO BOX 17153,DUBAI UAE",
        "address2": " "
    },
    {
        "code": "12010161",
        "address1": "OFFICE NO.2014-2015 INSIDE CARGO VIILAGE DUBAI AIRPORT P O BOX NO:293016 DUBAI UAE",
        "address2": " "
    },
    {
        "code": "12010162",
        "address1": "AV.AQUILINO DE LA GUARDIA CON",
        "address2": "CALLE 47. OCEAN BUSINESS PLAZA- OF. #2211. CIUDAD DE PANAMA-MARBELLA. PANAMA."
    },
    {
        "code": "12010163",
        "address1": "AL SARWAR MOHAMMAD ALI STREET COMMISSIONER ROAD SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010164",
        "address1": "C/O ETHIOPIAN AIRLINES BOLE INT'L AIRPORT STORES AND LOGISTICS DUBAI VILLAGE  DUBAI UAE",
        "address2": " "
    },
    {
        "code": "12010165",
        "address1": "M-1, QUEEN'S CENTRE, MT. KHAN ROAD, KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010166",
        "address1": "677 INNOVATION DR. UNIT #9",
        "address2": "KINGSTON, ON, CANADA K7K 7E6 "
    },
    {
        "code": "12010167",
        "address1": "BALDIYA ROUND ABOUT NEW INDUSTRIAL AREA P O BOX 45098 AJMAN UAE",
        "address2": " "
    },
    {
        "code": "12010168",
        "address1": "2.18506E+11",
        "address2": "ARENAL GRANDE 2127 MONTEVIDEO, URUGUAY 29241011"
    },
    {
        "code": "12010169",
        "address1": "P .O. BOX 2759 JEDDAH 21461",
        "address2": "SAUDI ARABIA "
    },
    {
        "code": "12010170",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010171",
        "address1": "25570 RYE CANYION RD UNIT K VALENCIA CA 91355",
        "address2": " "
    },
    {
        "code": "12010172",
        "address1": "PLOT 189 KHADIM HUSAIN SOLANGI ROAD GODAP KARACHI ",
        "address2": " "
    },
    {
        "code": "12010173",
        "address1": "6251 Box Springs BLVD ",
        "address2": "Riverside, CA 92507, USA. 9097204038 Usman Awan - usmanawan@gmail.com Manzoor Awan - ellahiusa@hotmail.com"
    },
    {
        "code": "12010174",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010175",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010176",
        "address1": "507, 508 Clifton Centre Kehkashan, Clifton",
        "address2": "Karachi, Pakistan.  Tel: 00-92-21-5872701-6 "
    },
    {
        "code": "12010177",
        "address1": "YONG KANG DIST TAIWAN CITY TAIWAN (R.O.C)",
        "address2": " "
    },
    {
        "code": "12010178",
        "address1": "POSTBOKS 266 ALNABRU N 0614 OSLO NORWAY",
        "address2": " "
    },
    {
        "code": "12010182",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010183",
        "address1": "Office No. 36, 6th Floor Arkay Square, Shahrah- E-Liaquat, Karachi- 74200 Pakistan",
        "address2": " "
    },
    {
        "code": "12010184",
        "address1": "12-603, Greenland Central Plaza, Haidian District, Beijing, 100095, China",
        "address2": " "
    },
    {
        "code": "12010185",
        "address1": "Rut. 020525260018.  Fono 099657748.",
        "address2": "Rocco Santorsa. Las Piedras Calle-Canelones 61 Uruguay"
    },
    {
        "code": "12010186",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010187",
        "address1": "2260 NW 102ND PL MIAMI FL33172 ATTENTION LESTER GAGA",
        "address2": " "
    },
    {
        "code": "12010188",
        "address1": "D-140/A-1 MANGHOPIR ROAD, ",
        "address2": "SITE KARACHI "
    },
    {
        "code": "12010189",
        "address1": "B-344/2 SECTOR 11-E NORTH KARACHI",
        "address2": " "
    },
    {
        "code": "12010190",
        "address1": "INDUSTRIES TRABE 12 91593 BURGBERNHEIH GERMANY ",
        "address2": " "
    },
    {
        "code": "12010191",
        "address1": "ABDULLAH COLONY NEW HAMZA GHOUS SIALKOT 51310 PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010192",
        "address1": "EAGLE FR LONGELY LANE SHARSTON M22 4SYY MANCHESTER UK",
        "address2": " "
    },
    {
        "code": "12010193",
        "address1": "ADD: QIUJIANGXINCUN VILLAGE,XINTANG",
        "address2": "STREET, XIAOSHAN DISTRICT HANGZHOU, ZHEJIANG PROV.CHINA VAT NO.: 91330109727620251W"
    },
    {
        "code": "12010194",
        "address1": "No. 213, Hoor centre, North Napier Road",
        "address2": "Karachi-Pakistan Hp# 0092-321-2077-662"
    },
    {
        "code": "12010195",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010196",
        "address1": "PLOT NO C/11 SECTOR 8A/4 AL-HABIB COOPERATIVE HOUSING SOCIETY SUPER HIGHWAY",
        "address2": " "
    },
    {
        "code": "12010197",
        "address1": "N 64 2060 ANTWERPEN BELGIUM",
        "address2": " "
    },
    {
        "code": "12010198",
        "address1": "ADD H-1170. AKBARI MANDI LAHORE",
        "address2": "PAKISTAN "
    },
    {
        "code": "12010199",
        "address1": "ROOM NO: 322 BUILDING 1. NO, 7, XINJI ROAD NANCHENG STREET DONGGUAN",
        "address2": "CITY GUANGDONG PROVINCE USCI + 9144190058139232D POST CODE: 523000, CHINA "
    },
    {
        "code": "12010200",
        "address1": "UNIT NO 4238 DMCC BUSEINESS CENTRE, LEVEL NO: 1 JEWELLERY AND GEMPLEX3, DUBAI UAE",
        "address2": " "
    },
    {
        "code": "12010201",
        "address1": "OFFICE NO 706 7TH FLOOR TRADE AVENUE HASRAT MOHANI ROAD, KARACHI, PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010202",
        "address1": "OSB 2001 CAD. NO:36 ESKISEHIR VAT NUMBER 381 001 9085 ",
        "address2": "ON BEHALF OF LUCERNA TRADING DMCC  "
    },
    {
        "code": "12010203",
        "address1": "ATATURK MH.ATASEHIR BULVARI NO: 20 ATASEHIR, ISTANBUL TURKEY",
        "address2": " "
    },
    {
        "code": "12010204",
        "address1": "25 THE HIGHLANDS, BOXHILL-ON-SEA,",
        "address2": "EAST SUSSEX, TN39 5HL, UNITED KINGDOM,"
    },
    {
        "code": "12010205",
        "address1": "208 2ND FLOOR SAJJAD CENTER LAHORE PAKISTAN PUNJAB 5400",
        "address2": " "
    },
    {
        "code": "12010206",
        "address1": "UNIT 3 THE BELL CENTRE NEWTON ROAD GATWICH BRITAIN",
        "address2": " "
    },
    {
        "code": "12010207",
        "address1": "UNIT 2A NO 12 XIANGXING 3RD RD XIANGYU FREE TRADE ZONE",
        "address2": " "
    },
    {
        "code": "12010208",
        "address1": "AEROTRUTURE MIDDLE EAST SERVICES AMES NJ # 13 ROAD AIR FREE ZONE NORTH DUBAI",
        "address2": " "
    },
    {
        "code": "12010209",
        "address1": "KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010210",
        "address1": "PO BOX 22927 DOHA QATAR",
        "address2": " "
    },
    {
        "code": "12010211",
        "address1": "B106A-2&#65292 INTERESTING CREATIVE COMMUNITY JAINPENG ROAD",
        "address2": " "
    },
    {
        "code": "12010212",
        "address1": "WEST 34TH STREET 4TH FLOOR NEW YORK 1001 USA",
        "address2": " "
    },
    {
        "code": "12010213",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010214",
        "address1": "KARACHI",
        "address2": " "
    },
    {
        "code": "12010215",
        "address1": "CHURCH STREET FATEH 51310 SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010216",
        "address1": "E EXPORTACAO EIRLI CNPJ 30 355 524 0001 66",
        "address2": " "
    },
    {
        "code": "12010217",
        "address1": "D64 S I T E KARACHI PAKISTAN C/O ALPINTER SA BELGIUM",
        "address2": " "
    },
    {
        "code": "12010218",
        "address1": "GRAMPIAN ENDURANCE CO ANTRAC HOLDING PVT LTD 1ST FLOOR M.MAGENTA ANTRAC TOWER",
        "address2": " "
    },
    {
        "code": "12010219",
        "address1": "118/25  RAGA  APARTMENT  8TH  MAIN ROAD SANTHA COLONY ANNA NAGAR CHENNAI INDIA",
        "address2": " "
    },
    {
        "code": "12010220",
        "address1": "WEST 34TH STREET 4TH FLOOR NEW YORK 1001 USA",
        "address2": " "
    },
    {
        "code": "12010221",
        "address1": "EXPORT NUMBER ESB55284996 C VORA TER N 35 17481 SANTA",
        "address2": " "
    },
    {
        "code": "12010222",
        "address1": "BUNGALOW A-173 BLOCK-01 GROUND FLOOR KARACHI",
        "address2": " "
    },
    {
        "code": "12010223",
        "address1": "BUNGLOW A-173 BLOCK 01 GROUND FLOOR KARACHI",
        "address2": " "
    },
    {
        "code": "12010224",
        "address1": "115A JALAN SS 21/37 RAMANSRA UTAMA 47400 PETALING JAYA SELANGOR",
        "address2": " "
    },
    {
        "code": "12010225",
        "address1": "18 59929 BRILON GERMANY",
        "address2": " "
    },
    {
        "code": "12010226",
        "address1": "PAKISTAN OFFICE # 2 AND # 3 AIRLINE LOGISTICS CENTRE EXPORT CARGO JIAP ZNKARACHI",
        "address2": " "
    },
    {
        "code": "12010227",
        "address1": "UNIT 2B POLAR PARK BATH ROAD SIPSON LONDON UB7 ODG",
        "address2": " "
    },
    {
        "code": "12010228",
        "address1": "House# D-213, DMCHS, Siraj ud Daula Road,  Karachi, Pakistan.",
        "address2": " "
    },
    {
        "code": "12010229",
        "address1": "OFFICE NO 206 2ND FLOOR DHEDHI BUSINESS AVENUE MAIN ESTATE AVENUE S I T E",
        "address2": " "
    },
    {
        "code": "12010230",
        "address1": "OLAYA STREET RIYADH SAUDI ARABIA",
        "address2": " "
    },
    {
        "code": "12010231",
        "address1": "PLOT NO.5,15 & 16 SECTOR C-2 KARACHI EXPORT",
        "address2": "PROCESSING ZONE, LANDHI INDUSTRIAL AREA KARACHI- 75150 PAKISTAN."
    },
    {
        "code": "12010232",
        "address1": "NO 11 RODNEY STREET COLOMBO",
        "address2": " "
    },
    {
        "code": "12010233",
        "address1": "5/2 3RD LANE 10390 RATMALANA WESTRERN PROVINCE SRILANKA",
        "address2": " "
    },
    {
        "code": "12010234",
        "address1": "779 A, STREET 5, PURAN NAGAR",
        "address2": "51310  SIALKOT - PAKISTAN "
    },
    {
        "code": "12010235",
        "address1": "VIA DE MARINI 1 16149 GENOVA ATT: PAOLA MASTROIANNI ",
        "address2": " "
    },
    {
        "code": "12010236",
        "address1": "UNIT 2 VICTORIA BUSINESS PARK COLWICK LOOP ROAD NETHEFIELD NOTTINGHAM",
        "address2": " "
    },
    {
        "code": "12010238",
        "address1": "1-2ND FLOOR, INTERNATIONAL PLAZA, BOHRA",
        "address2": "STREET, MULTAN CANTT. PAKISTAN. "
    },
    {
        "code": "12010239",
        "address1": "M. ISMAIL AIWAN-I-SCIENCE BUILDING",
        "address2": "FEROZEPUR ROAD,  LAHORE PAKISTAN"
    },
    {
        "code": "12010240",
        "address1": "31-Q GULBERG II, ",
        "address2": "LAHORE PAKISTAN 54660 "
    },
    {
        "code": "12010241",
        "address1": "890.900.943-1 CLL 11 NO. 31A-42 BOGOTA",
        "address2": "COLOMBIA PH 57-1-3649777 "
    },
    {
        "code": "12010242",
        "address1": "KOT KHIZRI 52001 5TH KM G T ROAD WAZIRABAD PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010243",
        "address1": "NEUENBURGER STRABE 33 79379 MULLAHEIM BADEN",
        "address2": " "
    },
    {
        "code": "12010244",
        "address1": "REBGARTENWEG 23 79576 WELL AM RHEIN GERMANY",
        "address2": " "
    },
    {
        "code": "12010245",
        "address1": "L20 A HAMRIYA FREE ZONE PHASE 2 SHARJAH UAE",
        "address2": " "
    },
    {
        "code": "12010248",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010249",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010250",
        "address1": "P.O. BOX 117627 DUBAI UAE",
        "address2": "TEL+971-4-2561275 FAX: +971-4-2561274 "
    },
    {
        "code": "12010251",
        "address1": "DAKWALA STOP SADRA BADRA DASKA ROAD SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010252",
        "address1": "C/O RADEEP SERVICES 77 HIGH STREET 04-06 HIGH STREET PLAZA SINGAPORE 179433",
        "address2": " "
    },
    {
        "code": "12010253",
        "address1": "5 SUNVIEW ROAD, SINGAPORE 627616",
        "address2": " "
    },
    {
        "code": "12010254",
        "address1": "Unit F4 Clonlara Avenue Baldonnell Business Park",
        "address2": "Dublin 22 D22 X072 Ireland Info@dublinwholesalevintage.com"
    },
    {
        "code": "12010255",
        "address1": "ZU LIN STREET LIN AN CITY ZHEJIANG PRO CHINA",
        "address2": " "
    },
    {
        "code": "12010256",
        "address1": "6241 RANDOLPH STREET COMMERCE,",
        "address2": "CA 90040, USA "
    },
    {
        "code": "12010257",
        "address1": "PACCA GARAH KASHMIR ROAD SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010258",
        "address1": "REAL DE MAYORAZGO NUM 130 12 OFICINA 148 COL XOCO CP 03330 ATENCION BERENICE LARA",
        "address2": " "
    },
    {
        "code": "12010259",
        "address1": "SHOP NO 198 2ND FLOOR",
        "address2": "CO-OPERATIVE MARKET ABDULLAH HAROON ROAD KARACHI"
    },
    {
        "code": "12010260",
        "address1": "DP 13/1 SECTOR 12-D NORTH KARACHI,",
        "address2": "INDUSTRIAL AREA, KARACHI-PAKISTAN. "
    },
    {
        "code": "12010261",
        "address1": "49 A BLOCK PECHS SHAHRAH E FAISAL KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010262",
        "address1": "8 12 BAB AL BAHRAIN BUILDING 150 ROAD 1507 MANAMA KINGDOM OF BAHRAIN ATTN ORASAD",
        "address2": " "
    },
    {
        "code": "12010263",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010264",
        "address1": "Add: #160, Huafeng Road, Xiacheng District, Hangzhou City,  Zhejiang Province, China ",
        "address2": " "
    },
    {
        "code": "12010265",
        "address1": "AKÇABURGAZ MAH. 3118 SOKAK.NO:2 ESENYURT 34522, ISTANBUL TURKIYE,",
        "address2": " "
    },
    {
        "code": "12010266",
        "address1": "SA-21,1ST FLOOR , SHAHNAZ",
        "address2": "ARCADE,158 BAHADURABAD MAIN  SHAHEED E- MILLAT ROAD, KARACHI-PAKISTAN"
    },
    {
        "code": "12010267",
        "address1": "VIA COVETTA , 2 SHOWROOM-VIA",
        "address2": "COVETTA,1 54033 CARRARA-ITALY"
    },
    {
        "code": "12010268",
        "address1": "1131 / C MUMTAZABAD MULTAN PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010269",
        "address1": "EMIRATES GROUP SECURITY HEAD QUARTERS BLOCK B GROUND FLOOR DUBAI AIRPORT FREE ZONE P O BOX 686 DUBAI UAE",
        "address2": " "
    },
    {
        "code": "12010270",
        "address1": "4/F BLOCK A, SHATIN IND. CENTRE, 5-7 YUEN SHUN CIRCUIT, SIU LEK YUEN,SHATIN, NT. HONG KONG",
        "address2": " "
    },
    {
        "code": "12010271",
        "address1": "SANAYI FATIH MAH 194/1 SOKAK NO 4 35414 SARNIC GAZIEMIR IZMIR TURKEY",
        "address2": " "
    },
    {
        "code": "12010272",
        "address1": "9185 SOUTH FARMER AVE SUITE 105 TEMPE AZ 85284 USA",
        "address2": " "
    },
    {
        "code": "12010273",
        "address1": "PLOT NO,CB-242,SECTOR 16-B,MEEZANINE FIRST AND SECOND FLOOR,",
        "address2": "GABOOL TOWN NORTH KARACHI INDUSTRIAL AREA,  KARACHI. NTN NO: 1210085-4"
    },
    {
        "code": "12010274",
        "address1": "347 5TH AVENUE SUIT 1504,\t\t\t\t",
        "address2": "NEW YORK , NY 10016 \t\t\t\t USA\t"
    },
    {
        "code": "12010275",
        "address1": "BEIJING SHAYANG RD,SHAHE, CHANPING DISTRICT,BEIJING, CHINA.",
        "address2": " "
    },
    {
        "code": "12010276",
        "address1": "P.O.BOX NO. 65859,DUBAI UNITED ARAB EMIRATES",
        "address2": " "
    },
    {
        "code": "12010277",
        "address1": "FLAT NO.ii-3 1ST FLOOR RAFAH-E-AAM SOCIETY KARACHI,PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010278",
        "address1": "POLT# 24, 1ST FLOOR, SECTOR 12-C,NORTH KARACHI, NORTH KARACHI INDUSTRIAL",
        "address2": "AREA KARACHI, KARACHI - 75850, PAKISTAN "
    },
    {
        "code": "12010279",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010280",
        "address1": "Suite 401, 4th Floor Bahria Complex II, M.T Khan Road Lalazar -75600, Pakistan",
        "address2": " "
    },
    {
        "code": "12010281",
        "address1": "NO.12 KHUWAJA YARANA MARKET,KANDHAR, AFGHANISTAN VIA KARACHI,PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010282",
        "address1": "4F 905 CHOUZHOU NORTH ROAD, YIWU,ZHEJIANG,CHINA",
        "address2": " "
    },
    {
        "code": "12010283",
        "address1": "BISMILLAH CHOWK CHONI SULEHRIYAN ROAD SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010284",
        "address1": "9419 MASON AVE CHATSWORTH CA 91311 USA",
        "address2": " "
    },
    {
        "code": "12010285",
        "address1": "9 SHAM PENG TONG PLAZA VICTORIA-MAHE SEYCHELLES",
        "address2": "TEL NO. 248-4323659 ALAM130@HOTMAIL.COM "
    },
    {
        "code": "12010286",
        "address1": "1-km, New Central Jail Road, Multan - Pakistan",
        "address2": " "
    },
    {
        "code": "12010287",
        "address1": "UNIT A2, DRAYCOTT BUSINESS PARK, CAM, DURSLEY, GL11 5DQ.",
        "address2": " "
    },
    {
        "code": "12010288",
        "address1": "LIMBURG HOHENSTRABE 4 65549 LIMBURG GERMANY",
        "address2": " "
    },
    {
        "code": "12010289",
        "address1": "20 PROGRESS ROAD LEIGH ON SEA ESSEX SS9 SPR UK",
        "address2": " "
    },
    {
        "code": "12010290",
        "address1": "SHOP # 1 EJAZ ARCADE MAIN MARKET GULBERG II LAHORE 54000 PAKISTAN ",
        "address2": " "
    },
    {
        "code": "12010291",
        "address1": "YUFENG BUILDING 1-9-13, NO. 42 NINGSHAN ROAD, HUANGGU DISTRICT, SHENYANG, CHINA",
        "address2": " "
    },
    {
        "code": "12010292",
        "address1": "AMA HOUSE 6 BEECHPARK SMITHSTOWN INDUSTRIAL ESTATE SHANNON, CO.CLARE CE V14 XF59 IE",
        "address2": " "
    },
    {
        "code": "12010293",
        "address1": "OFFICE NO 207, BANK STREET BUILDING ",
        "address2": "KHALID BIN WALEED ROAD BUR DUBAI DUBAI, UNITED ARAB EMIRATES TRN # 100434714000003 +971 4 3370079 , 3387144"
    },
    {
        "code": "12010294",
        "address1": "EMBARKATION HEADQUARTERS (NAVY) AT NSSD , WEST WHARF ROAD KARACHI SD 75260 PK",
        "address2": " "
    },
    {
        "code": "12010295",
        "address1": "100 S ROYAL LN COPPELL TX 75019 US",
        "address2": " "
    },
    {
        "code": "12010296",
        "address1": "ROOM 902, 9/F, BUILDING S2, NO. 475, CHANGHE ROAD,",
        "address2": "CHANGHE STREET, BINJIANG DISTRICT, HANGZHOU CITY, ZHEJIANG PROVINCE, CHINA"
    },
    {
        "code": "12010297",
        "address1": "ON BEHALF OF JOSEF SEIBEL ASIA PACIFIC LTD ROOM 109 FLAT 6 17/F BLOCK C TML TOWER 3 HOI SHING ROAD ",
        "address2": "NEW TERRITORIES HONG KONG "
    },
    {
        "code": "12010298",
        "address1": "LENINSKI PRP 15A FLOOR 10 OFFICE 4 119071 MOSCOW RUSSIA TEL +7 495 723 10 22",
        "address2": " "
    },
    {
        "code": "12010299",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010300",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010301",
        "address1": "LOUGHMORE ROAD RAHEEN BUSINESS PARK RAHEEN LIMERICK IRELAND",
        "address2": " "
    },
    {
        "code": "12010302",
        "address1": "P.O. BOX NO. 5 DARSON ROAD G.T. ROAD",
        "address2": "WAZIRABAD 52000 PAKISTAN Tel No: +92-55-660-3616   FAX : +92-55-660-0035"
    },
    {
        "code": "12010303",
        "address1": "Supply Chain Centre Mount Osborne Industrial Park",
        "address2": "Oakwell View Barnsley South Yorkshire S71 1HH United Kingdom Tel No: (0) 1226 329200 Fax No: (0) 1226 204558"
    },
    {
        "code": "12010304",
        "address1": "41 HILLAM ROAD INDUSTRAIL ESTATE",
        "address2": "OFF CANAL ROAD BRADFORD UK "
    },
    {
        "code": "12010305",
        "address1": "1000 NORTHBROOK PARKWAY  ",
        "address2": "SUITE # D, SUWANEE, GA, 30024, "
    },
    {
        "code": "12010306",
        "address1": "NIT 800 169 352 6 Y O MAGNUM ZONA FRANCE BOGOTA AV CENTENARIO 20 BODEGA",
        "address2": " "
    },
    {
        "code": "12010307",
        "address1": "P.O BOX 90218 OFFICE 214-J THE SQUARE, AL MAMZAR",
        "address2": "AL MAMZAR DUBAI United Arab Emirates (AE) "
    },
    {
        "code": "12010308",
        "address1": "VIA NAZIONALE EST 7 FRAZ. LEMIGNANO COLLECCHIO PR 43044 Italy (IT)",
        "address2": " "
    },
    {
        "code": "12010309",
        "address1": "No.8 Dawei 3rd.Rd.,Xinqiao 3rd industrial Zone, Xinqiao,  Baoan Dist. ,Shenzhen, PRC",
        "address2": " "
    },
    {
        "code": "12010310",
        "address1": "C/O T LTD POST VF 509  ST LUCIA WEST INDIES",
        "address2": " "
    },
    {
        "code": "12010311",
        "address1": "1105 MCKENDREE PARK LANE LAWRENCEVILLE GA 30043 USA",
        "address2": " "
    },
    {
        "code": "12010312",
        "address1": "3860 E HOLMES RD STE 108 MEMPHIS TN 38118 US",
        "address2": " "
    },
    {
        "code": "12010313",
        "address1": "Langer Kornweg 34 d 65451 Kelsterbach Germany",
        "address2": " "
    },
    {
        "code": "12010314",
        "address1": "Köseler köyü kocaeli kobi OSB. 18. CAD NO 31A DILOVASI KOCAELI ULUÇINAR 3910309056 ISTANBUL / TURKEY",
        "address2": " "
    },
    {
        "code": "12010315",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010316",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010317",
        "address1": "12TH LEVEL ARFA IT TOWER 346-B FEROZPUR ROAD LAHORE PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010318",
        "address1": "NO 237 JINGSON ROAD AIRPORT ECONOMIC AREA TIANJIN 300300 CHINA ",
        "address2": " "
    },
    {
        "code": "12010319",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010320",
        "address1": "F 152 HUB RIVER ROAD SITE KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010321",
        "address1": "DOMAINE DE LA MOTTE 56200 LES FOUGERETS FRANCE",
        "address2": " "
    },
    {
        "code": "12010322",
        "address1": "INTERNATIONAL DEPARTMENT NEUER PLATZ 1 33098 PADERBORN GERMANY",
        "address2": " "
    },
    {
        "code": "12010323",
        "address1": "HJALMAR PETRIS VÄG 49 35246 VÄXJÖ SWEDEN ",
        "address2": " "
    },
    {
        "code": "12010324",
        "address1": "KROKSTORPSVAGEN 7, SE 261 62 GLUMSLOV (HELSINGBORG) SWEDEN",
        "address2": " "
    },
    {
        "code": "12010325",
        "address1": "LAHORE OFFICE",
        "address2": " "
    },
    {
        "code": "12010326",
        "address1": "OFF NO 2  & 3 1ST FLOOR SHARJHA CENTRE SHADMAN MARKET LAHORE",
        "address2": " "
    },
    {
        "code": "12010327",
        "address1": "1102 A ST STE 315 TACOMA WA 98402 5001 UNITED STATES TEL 206 479 9784",
        "address2": " "
    },
    {
        "code": "12010328",
        "address1": "MAIN ROAD, CHOUNI SULEHRIYAN SIALKOT 51310 PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010329",
        "address1": "CHARLES E LAWSON 9532 PARKWAY EAST BIRMINGHAM, AL  35215 USA TEL(205) 833-5222",
        "address2": " "
    },
    {
        "code": "12010330",
        "address1": "PLOT NO B-3  FISH HARBOUR WEST WHARF KARACHI",
        "address2": " "
    },
    {
        "code": "12010331",
        "address1": "APPARATEBAU AG GEHRENSTRASSE 4 5074 CH EIKEN, SCHWEIZ",
        "address2": " "
    },
    {
        "code": "12010332",
        "address1": "Oberstrasse 149 CH-9001 St. Gallen / Switzerland",
        "address2": " "
    },
    {
        "code": "12010333",
        "address1": "PLOT  05, SECTOR 12-D,",
        "address2": "NORTH KARACHI INDUSTRIAL AREA KARACHI, PAKISTAN"
    },
    {
        "code": "12010334",
        "address1": "368 WASHINGTON RD. SUITE 4, SAYREVILLE,",
        "address2": "NJ 08872 TEL\\FAX: +17325925274 EMAIL ID: IMPORTS@GRAVITASLOGISTICS.COM VAT# \\ TAX ID: 88-1937217"
    },
    {
        "code": "12010335",
        "address1": "ROOM2109,NO.188 GUANGZHOU ROAD,NANJING CITY,JIANGSU PROVINCE,P.R.CHINA",
        "address2": " "
    },
    {
        "code": "12010336",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010337",
        "address1": "MALLORY HOUSE BALDWIN'S GATE NEWCASTLE UNDER LYME STAFFORDSHIRE",
        "address2": " "
    },
    {
        "code": "12010338",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010339",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010340",
        "address1": "DP21 SECTOR 12D IST FLOOR NORTH KARACHI INDUSTRIAL AREA KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010341",
        "address1": "T/A RED 60 32 DAYLESFORD ROAD CHEADLE SK81LF UK",
        "address2": " "
    },
    {
        "code": "12010342",
        "address1": "MATERIALS TRDG CO L L C PO BOX 120447 DUBAI",
        "address2": " "
    },
    {
        "code": "12010343",
        "address1": "C/O ETINAD ENGIREERING AND MARINE SERVICES ",
        "address2": " "
    },
    {
        "code": "12010344",
        "address1": "PLOT NO SA-5 SECTOR 6 G MEHRAN TOWN KORANGI",
        "address2": " "
    },
    {
        "code": "12010345",
        "address1": "SHIP SPARE IN TRANSIT C/O ALBO NAVIGATION LTD ALEXANDRIAS 2 BRIDGE TOWN 2ND FLOOR OFF 202",
        "address2": " ZIP 3013 PO BOX 58324 LIMASSOL CYPRUS TEL: 00357 25 565245 "
    },
    {
        "code": "12010346",
        "address1": "D-88/A, NEAR WALIKA HOSPITAL,",
        "address2": "S.I.T.E, KARACHI PAKISTAN. "
    },
    {
        "code": "12010347",
        "address1": "1655 NW 136 VENUE BUILDING-M SUNRISE FL 33323 USA ATTN SILVANA TEL:+1 954 749 3500",
        "address2": " "
    },
    {
        "code": "12010348",
        "address1": "MUSTAFA KEMAL MAH 2127 SOK ATA PLAZA NO 2/5-7 CANKAYA ANKARA TURKEY",
        "address2": "MERSIS NO 8556133434834412 TEL: +90 312 472 1147 TAX ID 4630110607 "
    },
    {
        "code": "12010349",
        "address1": "UNIT P14 P15 WESTERN INTERNATIONAL MARKET HAYES ROAD LONDON",
        "address2": " "
    },
    {
        "code": "12010350",
        "address1": "IN TRANSIT CARE OFF SUPER MARITIME AGENCY TREICHIVILE ZONE 2 LOCAUX EX BRACODI 18 BP 3008 ABIDJAN ",
        "address2": " "
    },
    {
        "code": "12010351",
        "address1": "CRYSTEL VIEW PLOT D 62 DMCHS KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010352",
        "address1": "AM SILCHERPFAD 3 64521 GROB GERAU GERMANY ,FRANKFURT ,GERMANY,6 4521,DE,00",
        "address2": " "
    },
    {
        "code": "12010353",
        "address1": "270 ENTERPRISES DRIVE NEWPORT NEWS VIRGINIA 23603 USA",
        "address2": " "
    },
    {
        "code": "12010354",
        "address1": "LONGHUA NEW DISTRICT OF SHENZHEN GUANLAN STREET ORANGE ORANGE POND COMMUNITY OLD VILLAGE, ",
        "address2": "PLANT A COLLI BOND INDUSTRIAL PARK IN A BUILDING , SECOND FLOOR CHINA "
    },
    {
        "code": "12010355",
        "address1": "368 Washington Rd, Ste 4",
        "address2": "Sayreville, NJ 08872 MC#1041005  "
    },
    {
        "code": "12010356",
        "address1": "HOUSE NO 16 STREET 21 F-6/2",
        "address2": "P. O . BOX 1118 ISLAMABAD PAKISTAN"
    },
    {
        "code": "12010357",
        "address1": "SANKT ANNAE PLADS 11",
        "address2": "1250 COPENHAGEN K DENMARK MOBILE +45 4089 1705 FACSIMILE +45 3393 1987 E-MAIL: JSHU@CPHGROUP.COM WWW.CPHGLOBAL.COM  "
    },
    {
        "code": "12010358",
        "address1": "STRANDVEJEN 72 DK-2900 HELLERUP",
        "address2": "Mail: import@goforward.dk "
    },
    {
        "code": "12010359",
        "address1": "OFFICE #201 MANSUR BUILDING AL QUSAIS INDUSTRIAL DUBAI",
        "address2": " "
    },
    {
        "code": "12010360",
        "address1": "BALDIYA ROUND ABOUT, NEW",
        "address2": "INDUSTRIAL AREA, PO BOX 45098, AJMAN, UAE"
    },
    {
        "code": "12010361",
        "address1": "C/O LOCAL CONSULTANCY,",
        "address2": "JUMEIRAH BUSINESS CENTER JLT, CITY DUBAI COUNTRY UAE.TELL +971568291627 EMAIL : AMYGDALA_INTERNATIONAL_TRADE@PROTONMAIL.COM"
    },
    {
        "code": "12010362",
        "address1": "Address: 7th Floor, Bahria Complex - IV,  Main Chaudhry Khaliq-uz-Zaman Road, Gizri,  Clifton, Karachi - 75600, Pakistan",
        "address2": " "
    },
    {
        "code": "12010363",
        "address1": "Hofplatz 2, DE 17194 Moltzow OT Tressow,",
        "address2": "Germany/Deutschland. Email: salzcentrale @salzcentrale.de Phone: +49(0)4088913098"
    },
    {
        "code": "12010364",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010365",
        "address1": "C/O S WHOLSALE UNIT 3 CROSSWAY PARK HITHCIN ROAD ARLESEY SG15 6SG UK TEL: 0208 84 3 5628",
        "address2": " "
    },
    {
        "code": "12010366",
        "address1": "CHABEEL PUR INDUSTRIAL AREA 10KM DASKA ROAD 51310 SIALKOT  PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010367",
        "address1": "13 CASTLE ST HELIER JERSEY JE2 3BT UNITED KINGDOM ",
        "address2": " "
    },
    {
        "code": "12010368",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010369",
        "address1": "C/O GED TRANSPORT SRL SHIP'S SPARES IN TRANSIT VIA ROMAIRONE 66 16163 GENOA ITALY",
        "address2": " "
    },
    {
        "code": "12010370",
        "address1": "MANAGER OPERATIONS OFFICE KHI ROOM 5058 LEVEL 5 JINNAH INTERNATIONAL AIRPORT KARACHI",
        "address2": " "
    },
    {
        "code": "12010371",
        "address1": "ENGIREERING IND SUPPLY CHAIN STORE AND LOGISTICS RECEIVING SETON CC 890 LOC 130 KAIA SAUDIA MEDICAL",
        "address2": "CC 507 JEDDAH KSA SVDEKAEDOPS@SAUDIA.COM "
    },
    {
        "code": "12010372",
        "address1": "9 TO H GUAN ROAD EAST # 04-01 ALLIANCE BUILDING SINGAPORE",
        "address2": " "
    },
    {
        "code": "12010373",
        "address1": "LAKSON SQUARE BUILDING NO 2 KARACHI SOUTH KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010374",
        "address1": "AIRPORT CARGO TERMINAL 2 SHARJAH UNITED ARAB EMIRATES 132 ",
        "address2": " "
    },
    {
        "code": "12010375",
        "address1": "100 AVENUE DU GENERAL LECLERC PANTIN 93500 France",
        "address2": " "
    },
    {
        "code": "12010376",
        "address1": "15 Rue de la Belle Borne - Cargo 7 BP 60419 93290 Tremblay-en-France",
        "address2": " "
    },
    {
        "code": "12010377",
        "address1": "FAO V12 INTERNATIONAL OFFICE 1111 REGAL TOWER BUSINESS BAY DOWNTOWN 57P6+P6 DUBAI",
        "address2": " "
    },
    {
        "code": "12010378",
        "address1": "SHANGHAI,CHINA",
        "address2": " "
    },
    {
        "code": "12010379",
        "address1": "BOUNDARY POINT BOUNDARY WAY HEMEL HEMEL HEMPSTEAD HP2 7SU HERTFORDSHIRE UNITED KINGDOM",
        "address2": " "
    },
    {
        "code": "12010380",
        "address1": "PLOT NO 47 SECTOR 7-A KORANGI INDUSTRIAL AREA KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010381",
        "address1": "PASEO GENOVEVO 37 13326 MONTIEL (CIUDAD REAL) SPAIN",
        "address2": " "
    },
    {
        "code": "12010382",
        "address1": "L-26 A BLOCK 22 F B AREA KARACHI PAKISTAN TRADE REGISTRATION NUMBER 0712517",
        "address2": " "
    },
    {
        "code": "12010383",
        "address1": "WEST CORNICHE ROAD PO BOX 39999 ABU DHABI UAE",
        "address2": " "
    },
    {
        "code": "12010384",
        "address1": "MR MATTIAS HILLBRAND M HILLBRAND@NORMANN.DE INDUSTRIESTR 3 59925 BRILON SCHARGENBERG",
        "address2": " "
    },
    {
        "code": "12010385",
        "address1": "NO 03B BIYAGAMA EXPORT PROCESSING ZONE BIYAGAMA MALWANA SRI LANKA",
        "address2": " "
    },
    {
        "code": "12010386",
        "address1": "LERCHEN STR 8 63150 HEUSSENTSAM FRANKFURT GERMANY 63150 DE 0491754511108",
        "address2": " "
    },
    {
        "code": "12010387",
        "address1": "PO BOX NO 17099 ZONE 56 BUILDING NO 166  DOHA DOHA QATAR",
        "address2": " "
    },
    {
        "code": "12010388",
        "address1": "MASJID SA’AD BIN ABI WAQAS D.H.A. PHASE IV. KARACHI.PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010389",
        "address1": "NO.1, LANE 88, JINGSHE ST., KANGLE VILLAGE, XINCHENG SHIANG HUALIEN COUNTY 971067, TAIWAN",
        "address2": " "
    },
    {
        "code": "12010390",
        "address1": "SHIP SPARES TRANSIT C/O C.B PENTON & CO S.A INTL BUSINESS PARK LAS BRUJAS AVE BLDG 3845 SUITE 5",
        "address2": " "
    },
    {
        "code": "12010391",
        "address1": "PLOT NO 257 SECTOR 24 KORANGI INDUSTRIAL AREA KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010392",
        "address1": "1919 NW 19TH ST SUITE 702 FORT LAUDERDALE FL 33311 UNITED STATES",
        "address2": " "
    },
    {
        "code": "12010393",
        "address1": "ADD 5 MOSTAFA KAMEL ST AL REHAB TOWER SECOND FLOOR FORT SAID POSTAL CODE 42511 ",
        "address2": " "
    },
    {
        "code": "12010394",
        "address1": "A-714, 7th Floor, Saima Trade Tower I.I Chundrigar Road Karachi",
        "address2": " "
    },
    {
        "code": "12010395",
        "address1": "Rd &, Shahrah-e-Faisal, Tipu Sultan Rd, Karachi Memon Co-operative Housing Society Karachi Memon Society PECHS, Karachi, Karachi City, Sindh",
        "address2": " "
    },
    {
        "code": "12010396",
        "address1": "ROOM 209,FLOOR 2,BUILDING NO.3,YARD NO.3,ZHONGHE ROAD,FENGTAI DISTRICT,BEIJING, CHINA",
        "address2": " "
    },
    {
        "code": "12010397",
        "address1": "Plot # 244, Sector 6 – A, Next to Alamgir Institute, Mehran Town, Korangi. Karachi – Pakistan",
        "address2": " "
    },
    {
        "code": "12010398",
        "address1": "2-B MANOHAR STREET NICHOLSON ROAD LAHORE PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010399",
        "address1": "MOSS FARM CRAVEN ROAD INKPEN BERKSHIRE RG 17 9DY ATT PETER PAGE",
        "address2": " "
    },
    {
        "code": "12010400",
        "address1": "343 MODEL TOWN",
        "address2": "SIALKOT PAKISTAN "
    },
    {
        "code": "12010401",
        "address1": "33222 LYNN AVE. ABBOTSFORD, BC",
        "address2": "V2S 1C9 CANADA PHONE: 250-753-7999 "
    },
    {
        "code": "12010402",
        "address1": "NO.3 YANXIN STREET,XIANXIAN ECONOMICDEVELOPMENTZONE, CANGZHOU CITY,HEBEI PROVINCE, CHINA",
        "address2": " "
    },
    {
        "code": "12010403",
        "address1": "U.A.E",
        "address2": " "
    },
    {
        "code": "12010404",
        "address1": "L 503 5A 1 NORTH KARACHI TOWNSHIP KARACHI 75850 PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010405",
        "address1": "R-990, BLOCK-20, F.B.AREA, ",
        "address2": "KARACHI-75950, PAKISTAN "
    },
    {
        "code": "12010406",
        "address1": "1155 PHAN VAN TRI STREET , WARD 10 , GO ",
        "address2": "VAP DISTRICT, HO CHI MINH CITY, VIETNAM Tel: (84 28) 6682 7544  Fax: (84 28) 35170729 Tax id: 0314108822 e-mail: support@skylinetransport.vn"
    },
    {
        "code": "12010407",
        "address1": "22 PHU MY STREET, WARD 22, BINH THANH DISTRICT,",
        "address2": "HO CHI MINH CITY, VIETNAM. Attn: Mrs Bui Thi Xinh, PH: +84 28 3512 2903"
    },
    {
        "code": "12010408",
        "address1": "KINGDOM OF BAHRAIN MR AWAD MR KSVIN CONTACT NO 033206900",
        "address2": " "
    },
    {
        "code": "12010409",
        "address1": "1000 NORTHBROOK PARKWAY ",
        "address2": "SUITE # D, SUWANEE, GA, 30024,  "
    },
    {
        "code": "12010410",
        "address1": "C/O GEORGES HALIFAX GRENADA TEL: 484 552 9012 484 552 9014",
        "address2": " "
    },
    {
        "code": "12010411",
        "address1": "E-1/3, D-37, Lane-W, Street No: 6, Ext-Cavalry Ground, Lahore-Pakistan.",
        "address2": " "
    },
    {
        "code": "12010412",
        "address1": "RONNETERRING 11 D-41068 MONCHENGLADBACH",
        "address2": " "
    },
    {
        "code": "12010413",
        "address1": "Unit 6, Elite Business Park SMITHSTOWN Shannon CE IE",
        "address2": " "
    },
    {
        "code": "12010414",
        "address1": "FREE TRADE ZONE CAIRO EGYPT",
        "address2": " "
    },
    {
        "code": "12010415",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010416",
        "address1": "NAVAL STORES DEPOT AT DOCKYARD KARACHI C/O COMMANDING OFFICER EMBARKATION HEADQUARTERS AT",
        "address2": "NSSD WEST WHARF ROAD KARACHI "
    },
    {
        "code": "12010417",
        "address1": "DAMSLUISWEG 32 1332 ED ALMERE NETHERLANDS VAT NL806439774B01",
        "address2": " "
    },
    {
        "code": "12010418",
        "address1": "Office NO:201 Mansur Building Al Qusais Industrial Second P.O Box :- 47570 ",
        "address2": " "
    },
    {
        "code": "12010419",
        "address1": "DP21, SECTOR 12D, IST FLOOR,",
        "address2": "NORTH KARACHI INDUSTRIAL AREA, KARACHI-PAKISTAN. NTN#9578658-3"
    },
    {
        "code": "12010420",
        "address1": "T/A RED 60 32 DAYLESFORD ROAD",
        "address2": "CHEADLE SK81LF U.K TELL # 7785497870"
    },
    {
        "code": "12010421",
        "address1": "NEKA PURA ZAFAR WAL ROAD PO BOX CANTT SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010422",
        "address1": "AV EDUARDO MONDLANE 324 MAPUTO MOZAMBIQUE",
        "address2": " "
    },
    {
        "code": "12010423",
        "address1": "INTEXZONA ZONA FRANCA PERMANTE KM 1 VIA SIBERIA FUNZA BODEGA 39D COLOMBO",
        "address2": " "
    },
    {
        "code": "12010424",
        "address1": "WS/592-2, JOHARABAD INDUSTRIAL AREA BLOCK 2 FEDRAL B AREA KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010425",
        "address1": "SHIRIR CHALA VABANIPUR BD-1704 GAZIPUR SADAR BANGLADESH",
        "address2": " "
    },
    {
        "code": "12010426",
        "address1": "Terminal Arnaud Logis Bairro do Grilo - Fetais- Camarate, 2680-183 Lisbon PRT Phone: +351 21948 9291",
        "address2": " "
    },
    {
        "code": "12010427",
        "address1": "KONYA YOLU 8 KM OGULBEY MAH. 3051 SOK NO 306830 ANKARA TURKEY TAX ID 0860042250",
        "address2": " "
    },
    {
        "code": "12010428",
        "address1": "9419 MASON AVE CHATSWORTH CA 91311 US",
        "address2": " "
    },
    {
        "code": "12010429",
        "address1": "8 ISLAND GROVE, BRAMPTON,L6X 0W6  ONTARIO, CANADA CUSTOMER SERVICE ",
        "address2": "TEL:+1 (437) - 264 - 2807  EMAIL:CANCS@NEDLLOYDGROUP.COM  TEL:+1 (416) - 841 - 0786  EMAIL:NARESHM@NEDLLOYDGROUP.COM  CONTACT PERSON : NARESH MISHRA MRS SONIA "
    },
    {
        "code": "12010430",
        "address1": "FLUGHAFENSTR 31 41066 MONCHENGLADBACH GERMANY ATTN MR CHRISTIAN SCHRODER",
        "address2": " "
    },
    {
        "code": "12010431",
        "address1": "POBOX 11-206BEIRUT LEBANON",
        "address2": " "
    },
    {
        "code": "12010432",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010433",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010434",
        "address1": "TO ATTN OF POLAND HAMBURG HANZELAAN 95 8017 JE ZWOLE P O BOX NO 659 8000 AR ZWOLE",
        "address2": " "
    },
    {
        "code": "12010435",
        "address1": "SUPPLY CHAIN CO.,LTD. EAST TOWER, NO.12069 SHENNAN",
        "address2": "ROAD, NANSHAN DISTRICT SHENZHEN, GUANGDONG, CHINA 0755-86263638 CS2@SZ-GREATOCEAN.COM"
    },
    {
        "code": "12010436",
        "address1": "CHICAGO 131 N. LIVELY BLVD.,",
        "address2": "ELK GROVE VILLAGE, IL. 60007 TEL: 1-847-439-2139 EMAIL: ORD-OCEANIMPORT@SPEEDMARK.COM"
    },
    {
        "code": "12010437",
        "address1": "F-61 - C, S.I.T.E.,",
        "address2": " "
    },
    {
        "code": "12010438",
        "address1": "F-33, HUB RIVER ROAD, S.I.T.E ",
        "address2": " "
    },
    {
        "code": "12010439",
        "address1": "F-33, HUB RIVER ROAD, S.I.T.E ",
        "address2": " "
    },
    {
        "code": "12010440",
        "address1": "171 The Atrium, Bury Old Road, Whitefield, Manchester, United Kingdom, M45 7AL    ",
        "address2": " "
    },
    {
        "code": "12010441",
        "address1": "A/22 S.I.T.E. MAURIPIR ROAD, KARACHI 75730 PAKISTAN.",
        "address2": " "
    },
    {
        "code": "12010442",
        "address1": "(GHEE UNIT) A/22, MAURIPUR ROAD, SHER SHAH, S.I.T.E., KARACHI 75730, PAKISTAN. TEL 32561101 FAX 32561873",
        "address2": " "
    },
    {
        "code": "12010443",
        "address1": "1105 MCKENDREE PARK LANE",
        "address2": "LAWRENCEVILLE GA 30043 USA "
    },
    {
        "code": "12010444",
        "address1": "115/II , 30TH STREET KHY E MUHAFIZ D.H.A PHASE VI KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010445",
        "address1": "7633 S MAIN ST MIDHALE UTAH 84047 UNITED STATE",
        "address2": " "
    },
    {
        "code": "12010446",
        "address1": "PLOT # 4 STREET NO 9 RASHEEDABAD JHANG ROAD FAISLABAD PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010447",
        "address1": "1300 NAPERVILLE DRIVE ROMEOVILLE IL 60446 TEL: 773 289 1241 FAX: 773 289 1357",
        "address2": " "
    },
    {
        "code": "12010448",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010449",
        "address1": "4254 GAYLING GARDENS MISSISSAUGA ON L5L 1Z9 CANADA",
        "address2": " "
    },
    {
        "code": "12010450",
        "address1": "1200 TEXAN TRAIL STE 150 GRAPEVINE TEXAS 76051 USA ATTN PREM CONTACT +603 5885 3888",
        "address2": " "
    },
    {
        "code": "12010451",
        "address1": "3/F LYTON BUILDING, 42 MODY ROAD TSIM SHA TSUI, KOWLOON, HONG KONG",
        "address2": " "
    },
    {
        "code": "12010452",
        "address1": "JAMMU ROAD,DHALO WALI SIALKOT,PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010453",
        "address1": "HENGCHANG COMMERCIAL BUILDING 804,JIANSHE NORTH  ROAD NO.188,",
        "address2": " HUADU DISTRICT, GUANGZHOU CITY ,GUANGDONG,CHINA "
    },
    {
        "code": "12010454",
        "address1": "7TH FLOOR EXECUTIVE TOWERS DOLMEN MALL CLIFTON KARACHI",
        "address2": " "
    },
    {
        "code": "12010455",
        "address1": "NO 8 XINGYI ROAD SHANGHAI P R CHINA",
        "address2": " "
    },
    {
        "code": "12010456",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010457",
        "address1": "756 PORT AMERICA PLACE,  SUITE 840",
        "address2": "GRAPEVINE, TX 76051 TEL: 817-4216603 EMAIL: DFW-OceanImport@speedmark.com"
    },
    {
        "code": "12010458",
        "address1": "Friedrich-List-Str. 47 Radebeul 01445 Germany (DE)",
        "address2": " "
    },
    {
        "code": "12010459",
        "address1": "PHUM TREAR,SANGKAT STOEUNG MEAN CHEY KHAN MEAN CHEY, PHNOM PENH CITY, KINGDOM OF CAMBODIA.",
        "address2": " "
    },
    {
        "code": "12010460",
        "address1": "No.79, St 476 , Toul Tompong1 Commune, Chamkamorn District, Phnom Penh City , Cambodia",
        "address2": " "
    },
    {
        "code": "12010461",
        "address1": "RODUNIOS ROAD 18 LITHUANIA LT-02188 VILNIUS",
        "address2": " "
    },
    {
        "code": "12010462",
        "address1": "79 EL MOLTAKA EL ARABY DISTRICT SHERATON HELIPOLIS CAIRO EGYPT",
        "address2": " "
    },
    {
        "code": "12010463",
        "address1": "1 BIS PLACE ARTHUR CHAUSSY 77000 MELUN FRANCE",
        "address2": " "
    },
    {
        "code": "12010464",
        "address1": "AKTI MIAOULI AND 2 KANTHAROU STREET 18537 PIRAEUS GREECE",
        "address2": " "
    },
    {
        "code": "12010465",
        "address1": "6 EDEN CANAL VILLAS THOKAR NIAZ LAHORE PAKISTAN PUNJAB",
        "address2": " "
    },
    {
        "code": "12010466",
        "address1": "230-59 INTERNATIONAL AIRPORT CENTER",
        "address2": "BLVD. SUITE 282 SPRINGFIELD GARDENS, NY 11413 TEL: 718-807-0008  MTO.NYC@SPEEDMARK.COM"
    },
    {
        "code": "12010467",
        "address1": "LOT C24, NO.3 ROAD, TAN DO INDUSTRIAL PARK, BINH TIEN 2 HAMLET, DUC HOA HA COMMUNE, DUC HOA DISTRICT, LONG AN, VIETNAM.",
        "address2": " "
    },
    {
        "code": "12010468",
        "address1": "RIDLERSTRASSE 35",
        "address2": "80339 MUENCHEN GERMANY"
    },
    {
        "code": "12010469",
        "address1": "A-54, STREET 71,BLOCK G SAIMA ARABIAN VILLAS KARACHI",
        "address2": " "
    },
    {
        "code": "12010470",
        "address1": "Bahçelievler Mah., Barboros Hayreddin Sk., No: 11, Torbalı / İzmir",
        "address2": " "
    },
    {
        "code": "12010471",
        "address1": "LANGER KORNWEG 34A, 65451 KELSTERBACH,GERMANY",
        "address2": " "
    },
    {
        "code": "12010472",
        "address1": "Breitscheidstr. 46 Dresden 01237 Germany (DE)",
        "address2": " "
    },
    {
        "code": "12010473",
        "address1": "1404  WEIR CHASE MISSASSAUGA ",
        "address2": "ON L5R 2W9  CANADA "
    },
    {
        "code": "12010474",
        "address1": "CORSO ITALIA 223 52100 AREZZO ITALIA",
        "address2": " "
    },
    {
        "code": "12010475",
        "address1": "ADD:XIAN JIAOTONG UNIVERSITY INDUSTRIAL, YANGZHOU",
        "address2": " "
    },
    {
        "code": "12010476",
        "address1": "48070406S AV CORBELLA 130 503A ESPLUGUES DE LLOBREGAT 08950 BARCELONA SPAIN",
        "address2": " "
    },
    {
        "code": "12010477",
        "address1": "SIALKOT",
        "address2": " "
    },
    {
        "code": "12010478",
        "address1": "KARACHI",
        "address2": " "
    },
    {
        "code": "12010479",
        "address1": "D‐137/C, S.I.T.E,",
        "address2": "KARACHI ‐ PAKISTAN TEL : 021‐32575253‐55 FAX : 021‐32575801"
    },
    {
        "code": "12010480",
        "address1": "250 MOONACHIE ROAD, SUITE 204",
        "address2": "MOONACHIE, NJ 07074 PHONE : 201-662-8200 FAX : 201-296-0030"
    },
    {
        "code": "12010481",
        "address1": "MASOOD ROOMI HOUSE, 5 OFFICERS ",
        "address2": "COLONY, KASHAN-E-MEHR-E-ROOMI,   MULTAN, PAKISTAN."
    },
    {
        "code": "12010482",
        "address1": "Masood Roomi House, 5 Officers Colony, ",
        "address2": "Kashan-e-Mehr-e-Roomi, Multan, Pakistan. "
    },
    {
        "code": "12010483",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010484",
        "address1": "61-C JAMI COMMERCIAL STREET -7, PHASE VII D.H.A. KARACHI - PAKISTAN.",
        "address2": " "
    },
    {
        "code": "12010485",
        "address1": "D8-A4CN-MY PHUOC 3 INDUSTRIAL PARK-THOI HOA, BEN CAT TOWN, BINH DUONG PROVINCE, VIETNAM",
        "address2": " "
    },
    {
        "code": "12010486",
        "address1": "Address:17-19-21 Nguyen Van Troi Str , Ward 11, Phu Nhuan Dist, HCM City, Viet Nam",
        "address2": " "
    },
    {
        "code": "12010487",
        "address1": "MOSQUERA CUNDINAMARCA CALLE 2 NO 18-93 PARQUE INDUSTRIAL SAN JORGE BODEGA",
        "address2": " "
    },
    {
        "code": "12010488",
        "address1": "266 MERRICK RD SUITE 200 LYNBROOK NY 11563 516-758-9138",
        "address2": " "
    },
    {
        "code": "12010489",
        "address1": "PLOT NO N.W.Z/1-P PORT QASIM AUTHORITY",
        "address2": " "
    },
    {
        "code": "12010490",
        "address1": "FRACHT OST / 2-811 8058 ZURICH AIRPORT SWITZERLAND ",
        "address2": " "
    },
    {
        "code": "12010491",
        "address1": "20 KM FEROZPUR ROAD LAHORE PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010492",
        "address1": "190/7 NGUYEN TIEU LA STR WARD 8 DIST 10 HOCHIMINH VIETNAM",
        "address2": " "
    },
    {
        "code": "12010493",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010494",
        "address1": "2ND FLOOR TRUST PLAZA LMQ ROAD MULTAN PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010495",
        "address1": "WILLIS ENGINE REPAIR CENTER (WERC) AVIATION HOUSE BROCASTLE ESTATE AVE WATER INDUSTRIAL ESTATE",
        "address2": "BRIDGEND SOUTH WALES UK CF31 3XR CARDIFF UK "
    },
    {
        "code": "12010496",
        "address1": "HELLESTRAAT 89 VILVOORDE BELGIUM CONTACT PERSON MUSTAFA KARACAN TECHNICAL ASSET MANAGER",
        "address2": " "
    },
    {
        "code": "12010497",
        "address1": "E/32-A, ESTATE AVENUE, S.I.T.E., ",
        "address2": "KARACHI-75700 PAKISTAN."
    },
    {
        "code": "12010498",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010499",
        "address1": "1612 KYOBASHI CHOU KU TOKYO",
        "address2": "MR KYOBA POSTAL CODE 104-0031 ATTENTION TO NORITAKA MATSUI CN>"
    },
    {
        "code": "12010500",
        "address1": "UFFICIO ACQUISTI CIALE ALEXANDRE GUSTAVE EIFFEL 100 LSOLA H3 1 ROMA ITALY",
        "address2": " "
    },
    {
        "code": "12010501",
        "address1": "IMPORT EXPORT DI AHMMED JASHIM VERONA VIALE DELLA FIERA MILAN IT",
        "address2": " "
    },
    {
        "code": "12010502",
        "address1": "51-65 FILONOS, STREET PIRAEUS 18535",
        "address2": "GREECE EMAIL: FP@MHS.GR TEL: +30 210.422.7587 PIC FOKION"
    },
    {
        "code": "12010503",
        "address1": "ADD: FLAT C 9/F WINNING HOUSE 72-76 WING LOK STREET SHEUNG WAN HK",
        "address2": " "
    },
    {
        "code": "12010504",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010505",
        "address1": "C2313# WANDA PLAZA, NO88 TONGJIANG RD, CHANGZHOU, JIANGSU, CHINA 213022",
        "address2": " "
    },
    {
        "code": "12010506",
        "address1": "B-03, KADAMTOLY, ADAMJEENAGAR",
        "address2": "SIDDHIRGANJ, NARAYANGANJ, BANGLADESH "
    },
    {
        "code": "12010507",
        "address1": "A",
        "address2": " "
    },
    {
        "code": "12010508",
        "address1": "43/1 , BLOCK KHUDA BAKHSH COLONY NEW AIRPORT ROAD LAHORE",
        "address2": " "
    },
    {
        "code": "12010509",
        "address1": "PO BOX : 111394 | SHOWROOM NO. 3 AIRPORT ROAD BUILDING , DUBAI , U.A.E",
        "address2": " "
    },
    {
        "code": "12010510",
        "address1": "C-3/1 FL-10 AL HAMRA SQUARE BLOCK E NORTH NAZIMABAD KARACHI ",
        "address2": " "
    },
    {
        "code": "12010511",
        "address1": "ALTUNIZADE MAH MAHIR IZ CAD B BLOCK NO 9/1B IC KAPI NO 7 USKUDAR ISTANBUL",
        "address2": " "
    },
    {
        "code": "12010512",
        "address1": "FULHAR, MADANPUR, BONDOR,",
        "address2": "NARAYANGONG, BANGLADESH. "
    },
    {
        "code": "12010513",
        "address1": "BAHRAIN",
        "address2": " "
    },
    {
        "code": "12010514",
        "address1": "SMALL INDUSTRIES ESTATE,",
        "address2": "SIALKOT - 51340 (PAKISTAN) "
    },
    {
        "code": "12010515",
        "address1": "20, 510A, MLADOSTLA,SOFIA, BULGARIA",
        "address2": "VAT: BG200203682 ATTN: DIMITAR CHIFCHIEV"
    },
    {
        "code": "12010516",
        "address1": "OFFICE NO 127 1ST FLOOR ",
        "address2": " "
    },
    {
        "code": "12010517",
        "address1": "KHYBER BLOCK FORTRESS STADIUM LAHORE PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010518",
        "address1": "HARI PUR CHOWK, 1.5KM DURGANWALI VIL/ BHAGO ROAD,",
        "address2": "SIALKOT 51310, PAKISTAN "
    },
    {
        "code": "12010519",
        "address1": "300 LIBERTY AVE. BROOKLYN, ",
        "address2": "NY 11207, US "
    },
    {
        "code": "12010520",
        "address1": "145-30 156TH STREET JAMAICA, NY",
        "address2": "11434 TEL. (718) 470 2900 FAX (718) 470 2882 OCEANIMPORT@PRIME-TRANSPORT.COM"
    },
    {
        "code": "12010521",
        "address1": "KURENKEYEVA No 3 06,BISHKEK,KYRGYZ REPUBLIC ",
        "address2": "1 1 1 1 l KIRGIZSTAN/KIRGIZSTAN. "
    },
    {
        "code": "12010522",
        "address1": "LOT F7A & F7B, ROAD NO. 8 & 3,TAN DO IP, DUC HOA HA COMMUNE,DUC HOA DIST.,LONG AN PROVINCE, ",
        "address2": "VIETNAM "
    },
    {
        "code": "12010523",
        "address1": "208 CHAK ROAD , ZIA TOWN FAISALABAD, PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010524",
        "address1": "KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010525",
        "address1": "PLOT # 498 500 SECTOR 7/A KORANGI K.I.A KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010526",
        "address1": "UNIT 4D THE BRAMERY BUSINESS PARK ALSTONE LANE CHELTENHAM GL51 8HE UK",
        "address2": " "
    },
    {
        "code": "12010527",
        "address1": "NO.1 CHUNA GROUND, NEAR KHAN AGENCY MPR COLONY BLOCK C, MAIN MANGHOPIR ROAD,KARACHI PAKISTAN.",
        "address2": " "
    },
    {
        "code": "12010528",
        "address1": "AN LAC VILLAGE, TRUNG TRAC COMMUNE VAN LAM DISTRICT HUNG YEN PROVINCE VIETNAM",
        "address2": " "
    },
    {
        "code": "12010529",
        "address1": "KRUPPSTR 3 48683 AHAUS GERMANY LANDLINE +49 2561 8602 341",
        "address2": " "
    },
    {
        "code": "12010530",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010531",
        "address1": "GORTLANDROE INDUSTRIAL ESTATE GORTLANDROE NENAGH CO TIPPERARY E45 R251 IRLAND ",
        "address2": " "
    },
    {
        "code": "12010532",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010533",
        "address1": "NO.969 TAOYUAN ROAD JINHUA ZHEJIANG CHINA",
        "address2": " "
    },
    {
        "code": "12010534",
        "address1": "KARACHI,PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010535",
        "address1": "NAZNAZ QR CLOSE TO FEDEX OFFICE ERBIL 44001 IRAQ ERBIL",
        "address2": " "
    },
    {
        "code": "12010536",
        "address1": "HAITIAN YI RD PUDONG SHNAGAI INT'L APT SHANGHAI CN 201202",
        "address2": " "
    },
    {
        "code": "12010537",
        "address1": "PLOT # 399, I-9/3 INDUSTRIAL AREA ISLAMABAD PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010538",
        "address1": "206 METROPOLIS TOWER, BURJ KHALIFA BOULEVARD, BUSINESS BAY, DUBAI, UAE",
        "address2": " "
    },
    {
        "code": "12010539",
        "address1": "PLOT NO. 6/2, SECTOR 15,",
        "address2": "KORANGI INDUSTRIAL AREA, KARACHI-74900, PAKISTAN."
    },
    {
        "code": "12010540",
        "address1": "UNIT 14C THAMES GATEWAY PARK,",
        "address2": "CHEQUERS LANE, DAGENHAM, RM9 6RH. LONDON U.K. TEL # 03300882434"
    },
    {
        "code": "12010541",
        "address1": "Suite No. 204 Marine Tower, 2nd Floor",
        "address2": "Block-4, Clifton, Karachi – Pakistan. TEL : +92 21 35377533"
    },
    {
        "code": "12010542",
        "address1": "STREET NO 19/202 FERNTREE GULLY ROAD PO BOX 3168 CLAYTON AUSTRALIA TEL 1300 86 629",
        "address2": "TAX ID 72 080 759 097 "
    },
    {
        "code": "12010543",
        "address1": "35-H SECTOR 12 (EME) DHA CANAL ROAD LAHORE PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010544",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010545",
        "address1": "FLAT NO 101 SWEET CORNER GARDEN EAST KARACHI",
        "address2": " "
    },
    {
        "code": "12010546",
        "address1": "292 ALMANOR STREET LEWISHILLE DALLAS",
        "address2": " "
    },
    {
        "code": "12010547",
        "address1": "Landmark Building (13th floor), 12-14, Gulshan-2, Dhaka-1212, Bangladesh. ",
        "address2": "farzana@speedmarkbd.com + 88 09666786636, Ext- 112"
    },
    {
        "code": "12010548",
        "address1": "PLOT 45 C SECTOR 31 D P&S CO-OPERATIVE HOUSING SOCIETY KORANGI KARACHI",
        "address2": " "
    },
    {
        "code": "12010549",
        "address1": "DEPT HAM UH/BR1 WEG BEIM JAGER 193 22335 HAMBURG GERMANY",
        "address2": " "
    },
    {
        "code": "12010550",
        "address1": "UNIT VICTORIA BUSINESS PARK COLWICK LOOP ROAD NETHERFIELD NOTTINGHAM",
        "address2": " "
    },
    {
        "code": "12010551",
        "address1": "VIEW PARK GATWALA, 12 KM",
        "address2": "SHEIKHUPURA ROAD, FAISALABAD, PAKISTAN"
    },
    {
        "code": "12010552",
        "address1": "1800 NW 133RD AVENUESUITE 900,MIAMI,FL 33182",
        "address2": "TEL:(305) 406-1167 FAX:(305) 406-1648, CELL# (954)668-6377 Attn: Glenn Wadler Email:Glenn@PROAGMIAMI.COM"
    },
    {
        "code": "12010553",
        "address1": "LENINSKI PRP 15A FLOOR 10 OFFICE 4 119071 MOSCOW RUSSIA",
        "address2": " "
    },
    {
        "code": "12010554",
        "address1": "FOR MAKING CANS SOUTH CORNISH ROAD ALKARAM INDUSTRIAL ",
        "address2": " "
    },
    {
        "code": "12010555",
        "address1": "49 WEST 37TH STREET NY NY 10019",
        "address2": " "
    },
    {
        "code": "12010556",
        "address1": "N-67, MIDDLE CIRCLE,  CONNAUGHT PLACE, NEW DELHI-110001, INDIA",
        "address2": " "
    },
    {
        "code": "12010557",
        "address1": "D-13-A6 Manghopir Road, S.I.T.E",
        "address2": "Karachi, Pakistan "
    },
    {
        "code": "12010558",
        "address1": "Petra Street Downtown,",
        "address2": "Amman - Jordan "
    },
    {
        "code": "12010559",
        "address1": "Jabal Al Hussein – Khalid Ibn Al Walid Str Bldg No. 177 – Office 403",
        "address2": "Amman – Jordan Tel: 962 6 5650340/1 Fax: 962 6 5650905 Mobile: 962 79 5423739 Email: sales@bluewhale-jo.com"
    },
    {
        "code": "12010560",
        "address1": "P O BOX 39498-00623 NAIROBI,",
        "address2": "KENYA PH: 0731938453 "
    },
    {
        "code": "12010561",
        "address1": "PLOT F# 222 LABOUR SQAURE SITE KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010562",
        "address1": "2330 2ND INDUSTRIAL CITY UNIT NO: 2 RIYADH 14332 6982 SA PO NO: 07944-2",
        "address2": " "
    },
    {
        "code": "12010563",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010565",
        "address1": "POLT NO 240 SECTOR 27 KORANGI INDUSTRIAL AREA KARACHI",
        "address2": " "
    },
    {
        "code": "12010566",
        "address1": "21 RIGA FEREOUS STR N EFKARPIA THESSALPNKI 564 29 GREECE PHN 00302310686540",
        "address2": " "
    },
    {
        "code": "12010567",
        "address1": "House No. E-8 , Ground Floor Hotel Faran Street ,  Block 6 , P.E.C.H.S , Karachi Pakistan",
        "address2": " "
    },
    {
        "code": "12010568",
        "address1": "AVD DE LA CONSTITUCION 219 POL IND MONTE BOYAL 45950",
        "address2": " "
    },
    {
        "code": "12010569",
        "address1": "RAI PUR STOP ZAFER RPAD SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010570",
        "address1": "PAKKA PEYA, S.I.E. DEFENCE ROAD",
        "address2": "SIALKOT - PAKISTAN "
    },
    {
        "code": "12010571",
        "address1": "3630 ROYAL SOUTH PARKWAY SUITE 240 UNION CITY ",
        "address2": " "
    },
    {
        "code": "12010572",
        "address1": "BERTH 5-10, MARGINAL WHARVES, PORT MOHAMMAD",
        "address2": "BIN QASIM, P.O. BOX: 6435, KARACHI - 75020 "
    },
    {
        "code": "12010573",
        "address1": "160A GUL CIRCLE SINGAPORE 629635",
        "address2": " "
    },
    {
        "code": "12010574",
        "address1": "NO. 31, BUKIT BATOK CRESCENT, #01-07 THE SPLENDOUR SINGAPORE 658070",
        "address2": " "
    },
    {
        "code": "12010575",
        "address1": "170-1, YUSAN DONG, YANGSAN, KYOUNGNAM, SOUTH KOREA",
        "address2": " "
    },
    {
        "code": "12010576",
        "address1": "PLOT.NO. 1E-03D,P.O BOX 42380, HAMRIYAH FREE ZONE,SHARJAH, U.A.E",
        "address2": " "
    },
    {
        "code": "12010577",
        "address1": "FORMALY KNOWN AS THE GENERAL TYRES & RUBBER COMPANY LTD H-23 / 2 LANDHI INDUSTRIAL AREA",
        "address2": " "
    },
    {
        "code": "12010578",
        "address1": "HOUSE 1 ADOLF VALLEY ESTATE HASSTO ACCRA GHANA GE-233 7656 ATTN MR EMMANUEL",
        "address2": " "
    },
    {
        "code": "12010579",
        "address1": "18 SIN MING LANE # 06-28 MIDVEIW CITY ",
        "address2": " "
    },
    {
        "code": "12010580",
        "address1": "C/O ALBAHARIA SHIPPING CO 54 ISMAILIA STREET ROUSHDY ALEXANDRIA EGYPT",
        "address2": " "
    },
    {
        "code": "12010581",
        "address1": "C/O S. WHOLESALE  UNIT 3 CROSSWAY PARK HITCHIN ROAD ARLESEY SG15",
        "address2": " "
    },
    {
        "code": "12010582",
        "address1": "40 WESTERN AVENUE, BRENTWOOD, ESSEX CM14 GB. UNITED KINGDOM",
        "address2": " "
    },
    {
        "code": "12010583",
        "address1": "ROOM 2510, 25TH FLOOR, CHAMBER OF",
        "address2": "COMMERCE BUILDING, FANXIAN NEW DISTRICT PUYANG CITY, HENAN PROVINCE, CHINA"
    },
    {
        "code": "12010584",
        "address1": "BUILDING 9 BRITANNIA COURT THE GREEN WEST DRAYTON UNITED KINGDOM",
        "address2": " "
    },
    {
        "code": "12010585",
        "address1": "4/F Bldg.5, 88 Fangsi Road, Shanghai , P.R.China 201601",
        "address2": " "
    },
    {
        "code": "12010586",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010587",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010588",
        "address1": "9th Flr., Manoonpol Bldg. 2, 2884/1 New Petchburi Rd. Bangkapi, Huaykwang, Bangkok 10310, Thailand",
        "address2": " "
    },
    {
        "code": "12010589",
        "address1": "2nd Floor, Glass Tower, Clifton PSO Head Off. Karachi-Pakistan. ",
        "address2": " "
    },
    {
        "code": "12010590",
        "address1": "L82 MADINA MARKET GARDEN ROAD KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010591",
        "address1": "NO 30 MAN YUE STREET UNIT K 12/F SUMIT BUILDING HUNGHOM KOWLOON",
        "address2": " "
    },
    {
        "code": "12010592",
        "address1": "SM TOWER HOUSE 14 ROAD 02 SECTOR 03 UTTARA DHAKA",
        "address2": " "
    },
    {
        "code": "12010593",
        "address1": "NO 2 NINKU LINK SECRETARIAT JOS PLATEAU STATE NIGERIA",
        "address2": " "
    },
    {
        "code": "12010594",
        "address1": "C/O 2 S.V PHARM HALIFAX STREET BLVD JAMES ST GEORGE GRENADA ",
        "address2": " "
    },
    {
        "code": "12010595",
        "address1": "LOT 2. JALAN PERUSAHAAN RINGAN, OFF JALAN GENTING KLANG, 53200 KUALA LUMPUR (MALAYSIA)",
        "address2": " "
    },
    {
        "code": "12010596",
        "address1": "SUITE 6.06, LEVEL 6, MENARA TREND, IMS, NO.68.JLN BATAI LAUT 4,TAMAN INTAN, 41300 KLANG,S.E.MALAYSIA",
        "address2": " "
    },
    {
        "code": "12010597",
        "address1": "KORANGI INDUSTRIAL AREA PLOT #402 SECTOR 7/A LINE #5TH KARACHI (PAKISTAN) ",
        "address2": " "
    },
    {
        "code": "12010598",
        "address1": "VIA PROVINCIALE FRANCESCA NORD 72 56020 Santa Maria a Monte (PI) ITALY",
        "address2": " "
    },
    {
        "code": "12010599",
        "address1": "VIA LEONARDO DA VINCI 36 20877 RONCELLO (MB) ITALY",
        "address2": " "
    },
    {
        "code": "12010600",
        "address1": "Suite # M1, Mezzanine Floor Trade Avenue Hasrat Mohani Road, Seari Quarters, Karachi,Pakistan",
        "address2": " "
    },
    {
        "code": "12010601",
        "address1": "112/1, EID GAH ROAD ,PAGAR,TONGI ,GAZIPUR DHAKA-1000, BANGLADESH",
        "address2": " "
    },
    {
        "code": "12010602",
        "address1": "11362 SANDHAVEN DR. RICHMOND,",
        "address2": "HOUSTON, TX 77407, USA. "
    },
    {
        "code": "12010603",
        "address1": "C/O HAMAR TRADING OFF MAKKAH AL MUKARRMA ROAD KM 6 ",
        "address2": " "
    },
    {
        "code": "12010604",
        "address1": "Süßwarenmaschinen GmbH Ringstraße 1 56579 Rengsdorf Germany",
        "address2": " "
    },
    {
        "code": "12010605",
        "address1": "230-231 SUNDER INDUSTRIAL ESTATE LAHORE PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010606",
        "address1": "99 DE DUAN STR HOAN KIEM DIST HANOI",
        "address2": " "
    },
    {
        "code": "12010607",
        "address1": "UL.HRESTO BOTEV 61",
        "address2": "GR.BURGAS, BULGARIA "
    },
    {
        "code": "12010608",
        "address1": "E-17/A S.I.T.E KARACHI -PAKISTAN",
        "address2": "Ph: +92-21-32568536 (4 LINES) Fax: +92-21-32568536 "
    },
    {
        "code": "12010609",
        "address1": "VIA DELLA TECNICA, 17 36054 Montebello Vicentino (VI) ITALY",
        "address2": " "
    },
    {
        "code": "12010610",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010611",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010612",
        "address1": "DOHA QATAR",
        "address2": " "
    },
    {
        "code": "12010613",
        "address1": "28DAE JEON GIL, YOUNG CHEONCITY",
        "address2": "GYEUNG BUK, KOREA.  T. +82 010 3511‐4777 E. tkddhks1103@hanmail.net"
    },
    {
        "code": "12010614",
        "address1": "UNITS 2 3 POUND FARM POUND LANE SHIPLEY WEST SUSSEX RH13 8QB UNITED KINGDOM",
        "address2": " "
    },
    {
        "code": "12010615",
        "address1": "16-20, GARDEN STREET,",
        "address2": "MARRICKVILLE N.S.W 2204, "
    },
    {
        "code": "12010616",
        "address1": "RODUNIOS KELIAS 2 VILNIUS 02188 Lithuania",
        "address2": " "
    },
    {
        "code": "12010617",
        "address1": "3F NO.22 LANE 1555,HUICHUANG INTERNATIONAL BUSINESS DISTRICT, ",
        "address2": "WEST JINSHAJIANG ROAD,SHANGHAI,CHINA "
    },
    {
        "code": "12010618",
        "address1": "PREMISES NO B34BS330303WS62 JEBEL ALI FREE ZONE DUBAI UNITED ARAB EMIRATES",
        "address2": " "
    },
    {
        "code": "12010619",
        "address1": "FABRIKKVEIEN 23 4033 STAVANGER NORWAYMSKU5864752",
        "address2": " "
    },
    {
        "code": "12010620",
        "address1": "C/O SYED BAIDAR ENTERPRISES SA0371085 X-NO-5.2 PANGSAPURI PALAMA JALAN PALAMA RAJA",
        "address2": " "
    },
    {
        "code": "12010621",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010622",
        "address1": "P 8/15 STREET No. 3 TALIAN WALA ROAD, UMER",
        "address2": "FAROOQ TOWN NARWALA ROAD , FAISALABAD 38000 – PAKISTAN"
    },
    {
        "code": "12010623",
        "address1": "KARACHI",
        "address2": " "
    },
    {
        "code": "12010624",
        "address1": "D 23 SOUTH AVENUE SITE KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010625",
        "address1": "DOETINCHEMSEWEG 69 7007 CB DOETINCHEM THE NETHERLANDS",
        "address2": " "
    },
    {
        "code": "12010626",
        "address1": "GROUNG FLOOR SHOP # 2 PLOT # 110-112 C CNTRAL COMMERCIAL SUNARA GAIL TARIQ RD",
        "address2": " "
    },
    {
        "code": "12010627",
        "address1": "LP 113 MUNROE ROAD CUNUPIA TRINIDAD W.I TEL: 868 689 8675",
        "address2": " "
    },
    {
        "code": "12010628",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010629",
        "address1": "OFFICE NO 815 PARK AVENUE BLOCK 6 PECHS SHAHRAH E FAISAL KARACHI",
        "address2": " "
    },
    {
        "code": "12010630",
        "address1": "16920 HILLSIDE AVE 2ND FLOOR SUITE 01 JAMAICA NY 11432 C.P TASNUVA JAHAN",
        "address2": " "
    },
    {
        "code": "12010631",
        "address1": "PLOT LA-8/21, BLOCK 22, F.B INDUSTRIAL AREA, KARACHI.",
        "address2": " "
    },
    {
        "code": "12010632",
        "address1": "C251-252,JIYIN SQUARE,XINSHENG VILLAGE, LONGGANG, SHENZHEN, GUANGDONG,CHINA ",
        "address2": " "
    },
    {
        "code": "12010633",
        "address1": "ALI PUR GUJJRAN P.O SAMBRIAL SIALKOT",
        "address2": " "
    },
    {
        "code": "12010634",
        "address1": "ARUA PARK PLAZA RM-272 BEN KIWANUKA STREET KAMPALA UGANDA",
        "address2": " "
    },
    {
        "code": "12010635",
        "address1": "Yodoyabashi Square, 2-6-18, Kitahama, Chuo-ku, Osaka 541-0041, Japan",
        "address2": " "
    },
    {
        "code": "12010636",
        "address1": "45-50 INDUSTRIAL AREA GULBERG NEW YORK NY 10118 USA ",
        "address2": " "
    },
    {
        "code": "12010637",
        "address1": "200 W DEVON AVENUE STE 8 BENSEVILLE IL 60106 ",
        "address2": " "
    },
    {
        "code": "12010638",
        "address1": "KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010639",
        "address1": "OFFICE 211 BUSINESS AVENUE SHARA E FAISAL KARACHI",
        "address2": " "
    },
    {
        "code": "12010640",
        "address1": "BOSCH HOUSE 221 SECTOR 23 KORANGI INDUSTRIAL AREA KARACHI",
        "address2": " "
    },
    {
        "code": "12010641",
        "address1": "273 TAY SON STREET DONG DISTRCT HANOI VIETNAM",
        "address2": " "
    },
    {
        "code": "12010642",
        "address1": "LAHORE",
        "address2": " "
    },
    {
        "code": "12010643",
        "address1": "EL BESHLAWY ELBESHLAWY COMPLEX ALEXADRIA AGRICUL TURE QISM DAM ANHOUR EL BEHEIRA GOVERNOATE",
        "address2": " "
    },
    {
        "code": "12010644",
        "address1": "19 KM  MULTAN ROAD LAHORE",
        "address2": " "
    },
    {
        "code": "12010645",
        "address1": "GRONLANDSVEG 2 A 2050 JESSHEIM NORWAY ",
        "address2": " "
    },
    {
        "code": "12010646",
        "address1": "A-29 NORTH WESTERN INDUSTRIAL ZONE",
        "address2": " "
    },
    {
        "code": "12010647",
        "address1": "UNIT 5 MOTERWAY TRADING ESTATE MILL STREET BIRMINGHAM B6 48S",
        "address2": " "
    },
    {
        "code": "12010648",
        "address1": "PLOT # 79 / S GROUND FLOOR PORTION, PECHS BLOCK 02 KARACHI,PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010649",
        "address1": "ul. Wschodnia 9, Szamoty Nadarzyn 05-830 Poland",
        "address2": " "
    },
    {
        "code": "12010650",
        "address1": "BUILDING # 40-C OFFICE # 101 14TH COMMERCIAL STREET DHA PHASE II EXT KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010651",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010652",
        "address1": "P.O BOX 121 P.C 114 AL AMRAT MUSCAT OMAN",
        "address2": " "
    },
    {
        "code": "12010653",
        "address1": "5502 NW 37TH AVE MIAMI FL 33142 US ",
        "address2": " "
    },
    {
        "code": "12010654",
        "address1": "SCHARNHORSTSTRASSE 7 B 35260 STADTALLENDORF GERMANY",
        "address2": " "
    },
    {
        "code": "12010655",
        "address1": "C/O MASTER FUGRO GAUSS UNIVERSAL SHIPPING",
        "address2": " "
    },
    {
        "code": "12010656",
        "address1": "C/O ROHOFFE PVT LTD FAAMUDHEYRIGE 20209 ORCHID MAGU MALE 20209 MALDIVES",
        "address2": " "
    },
    {
        "code": "12010657",
        "address1": "ROOM 701 B-C EAST OCEAN CENTRE 98 GRANVILLE ROAD TSIM SHA TSUI EAST,KOWLOON, HONGKONG ",
        "address2": " "
    },
    {
        "code": "12010658",
        "address1": "148/1 KYNSEY ROAD COLOMBO 06 SRI LANKA",
        "address2": " "
    },
    {
        "code": "12010659",
        "address1": "C251-252 jiyin square, xinsheng village,Longgang District, shenzhen,Guangdong China",
        "address2": " "
    },
    {
        "code": "12010660",
        "address1": "UNIT D4 HORIZON LOGISTICS PARK HARRISTOWN SWORDS CO DUBLIN K673A8 IRELAND ",
        "address2": " "
    },
    {
        "code": "12010661",
        "address1": "PLOT NO. 6-8 & 41-47 & 84, SECTOR-5&7 CHATTOGRAM EXPORT",
        "address2": " "
    },
    {
        "code": "12010662",
        "address1": "CO AIRPORT ROAD OPP PETROL PUMP SIALKOT PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010663",
        "address1": "382/X KUMBUKA ROAD RAIGAMA BANDARGAMA 12530 COLOMBO SRILANKA",
        "address2": " "
    },
    {
        "code": "12010664",
        "address1": "C-1 JAWED CENTRE DEFENCE ROAD",
        "address2": " "
    },
    {
        "code": "12010665",
        "address1": "GROUND FLOOR BAHRIA COMPLEX III M.T KHAN ROAD KARACHI",
        "address2": " "
    },
    {
        "code": "12010666",
        "address1": "UNIT 3310 JUMEIRAH BAY X3 CLUSTER X JUMEIRAH LAKES TOWERS DUBAI UAE ATTN MR COBUS VAN ROOIJEN ",
        "address2": " "
    },
    {
        "code": "12010667",
        "address1": "NAVERLAND 1 C 1ST FLOOR 2600 GLOSTRUP DENMARK",
        "address2": " "
    },
    {
        "code": "12010668",
        "address1": "(GREATER ASIA) P 4 CHIN BEE DRIVE, SINGAPORE 619855",
        "address2": " "
    },
    {
        "code": "12010669",
        "address1": "UNITS 15 & 16 FRAMPTON INDUSTRIAL PARK BRIDGE ROAD FRAMPTON ON SEVERN",
        "address2": " "
    },
    {
        "code": "12010670",
        "address1": "T/A ARVILLE UNIT 2 DRAYCOTT BUSINESS PARK CAM DURSLEY",
        "address2": " "
    },
    {
        "code": "12010671",
        "address1": "31-33 ROYAL SCOT ROAD DERBY PRIDE PARK DERBYSHIRE UK DE248AJ",
        "address2": " "
    },
    {
        "code": "12010672",
        "address1": "B-25 GROUND FLOOR BLOCK 12 KDA SCHEMR 36 GULISTAN E JOHAR KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010673",
        "address1": "FDBC0122 COMPASS BUILDING AL SHOHADA ROAD AL HAMRA INDUSTRIAL ZONE FZ-RAS AL KHAIMAH UAE",
        "address2": " "
    },
    {
        "code": "12010674",
        "address1": "MOZA RAM KALI, BAHAWALPUR ROAD, MULTAN,  MULTAN CANTT. SHER SHAH TOWN, PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010675",
        "address1": "ROOM 2005-2006,BUILDING A,DINGXIN CENTER SILIHE ROAD,HEFEI,ANHUI,CHINA",
        "address2": " "
    },
    {
        "code": "12010676",
        "address1": "STREET NO 1 BESIDE BHATTI FLOOR MILLS SHALIMAR LINK ROAD",
        "address2": " "
    },
    {
        "code": "12010677",
        "address1": "STR DRUMUL GARII ODAI 1A AIRPORT PLAZA BUILDING 3RD FLOOR ROOM 3 OTOPENI ILFOV ROMANIA",
        "address2": " "
    },
    {
        "code": "12010678",
        "address1": "252-B, PECHS Block 6, Karachi, Pakistan",
        "address2": " "
    },
    {
        "code": "12010679",
        "address1": "218 SHAMS CHAMBER SHARAH LIAQUAT KARACHI 74000 PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010680",
        "address1": "MARKAYS HOUSE, GORDON ROAD, WALTHAM ABBEY, EN9 1AF,UNITED KINGDOM.",
        "address2": " "
    },
    {
        "code": "12010681",
        "address1": "LANE A UNIT 5 6 7 INDUSTRIAL ESTATE SIALKOT 51310 PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010682",
        "address1": "1150 HARBOR BAY PARKWAY ALAMEDA CA 94502 USA",
        "address2": " "
    },
    {
        "code": "12010683",
        "address1": "Contour Avenue 71 2133 LD Hoofddorp The Netherlands  VAT: NL862143767B01 EORI: NL862143767",
        "address2": " "
    },
    {
        "code": "12010684",
        "address1": "PLOT NO 15 SECTOR 4/E STREET NO 1 SAEEDABAD BALDIA TOWN KARACHI",
        "address2": " "
    },
    {
        "code": "12010685",
        "address1": "FLAT 25  BUILDING 71 ROAD 16 BLOCK 12 HIDD KINGDOM BAHRAIN",
        "address2": " "
    },
    {
        "code": "12010686",
        "address1": "P O BOX NO 296186 DUBAI UAE ",
        "address2": " "
    },
    {
        "code": "12010687",
        "address1": "1202 MELISSA DRIVE BENTONVILLE, AR 72712, USA",
        "address2": " "
    },
    {
        "code": "12010688",
        "address1": "PLOT  # 141 SECTOR # 27 KORANGI INDUSTRIAL AREA KARACHI / PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010689",
        "address1": "SAPS COMPLEX MALIR AVENUE JINNAH INTL AIRPORT KARACHI",
        "address2": " "
    },
    {
        "code": "12010690",
        "address1": "4 FALCON WAY FELTHAM MIDDLESEX TW14 0RX UNITED KINGDOM",
        "address2": " "
    },
    {
        "code": "12010691",
        "address1": "JINYANG RD,SHANGHU TOWN,CHANGSHU CITY,JIANGSU,CHINA",
        "address2": " "
    },
    {
        "code": "12010692",
        "address1": "20 QUAI MULLENHEIM 67000 STRASBOURG FRANCE",
        "address2": " "
    },
    {
        "code": "12010693",
        "address1": "HAHN STRABE 38 63303 DREIEICH EE FRANKFURT ",
        "address2": " "
    },
    {
        "code": "12010694",
        "address1": "5 SHEEPFOOT LANE PRESTWICH M25 MANCHESTER",
        "address2": " "
    },
    {
        "code": "12010695",
        "address1": "AVINGEGRAND 16368 SPANGA STOCKHOLM",
        "address2": " "
    },
    {
        "code": "12010696",
        "address1": "OSB.6 CADE NO 18, ESKISEHIR/ TURKIYE 26110 ",
        "address2": " "
    },
    {
        "code": "12010697",
        "address1": "NAK VE TIC LTD STI CUMHURIYET CAD NO: 123 34373 HARBIYE ISTANBUL,TURKEY",
        "address2": " "
    },
    {
        "code": "12010698",
        "address1": "HOUSE 1/A 32 ETAWAH CHS SEC 52-A SCHEME NO 33 SCHEME NO 33 SOHRAB GOTH MALIR GADAP",
        "address2": " "
    },
    {
        "code": "12010699",
        "address1": "WARAICH FRUITS IMPORT & EXPORT WORLDWIDE GERMANY ",
        "address2": " "
    },
    {
        "code": "12010700",
        "address1": "Near Zero Point, Wazirabad Road Sambrial Sialkot-Pakistan Tel: +92 52 3571646 Fax:+92 52 3257068",
        "address2": " "
    },
    {
        "code": "12010701",
        "address1": "CITY ASENOVGRAD STR. DRUJBA 55, BULGARIA BURGAS, BULGARIA",
        "address2": " "
    },
    {
        "code": "12010702",
        "address1": "9951 ATLANTIC BLVD ,SUITE 122 JACKSONVILLE ,FL 32225 ",
        "address2": " "
    },
    {
        "code": "12010703",
        "address1": "Building 23-C, 2nd Floor, Old Sunset Boulevard, Phase 2, DHA, Karachi    ",
        "address2": " "
    },
    {
        "code": "12010704",
        "address1": "PLOT 23 SECTOR 24 KORANGI INDUSTRIAL AREA KARACHI",
        "address2": " "
    },
    {
        "code": "12010705",
        "address1": "WERNER OTTO OTTO STRASSE 1-7-22179 HAMBURG GERMANY",
        "address2": " "
    },
    {
        "code": "12010706",
        "address1": "EICHHORSTERS TR 1A 12689 BERLIN GERMANY",
        "address2": " "
    },
    {
        "code": "12010707",
        "address1": "21, MAQBOOLABAD TIPU SULTAN ROAD, KARANCHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010708",
        "address1": "PENNINE BUSINESS PARK PILSWORTH ROA HEYWOOD OL1 0TL UNITED KINGDOM",
        "address2": " "
    },
    {
        "code": "12010709",
        "address1": "1ST FLOOR AVIATION HOUSE RUSSELL GARDENS WICKFORD ESSEX SS11 8BF",
        "address2": " "
    },
    {
        "code": "12010710",
        "address1": "DAK KHANA DHARIWAL HARLANWALI KOT MAND TEHSIL & DISTRICT GUJRANWALA",
        "address2": " "
    },
    {
        "code": "12010711",
        "address1": "VOROSOVA LERCHEN STR N 8 63150 HEUSENSTAMM DE GERMANY",
        "address2": " "
    },
    {
        "code": "12010712",
        "address1": "ANA ISABEL BEJARANO DIAZ JOHNISSBURG 10 61137 SCHENECK",
        "address2": " "
    },
    {
        "code": "12010713",
        "address1": "198 CRAWEY GREEN ROAD LUTON LU20SH",
        "address2": " "
    },
    {
        "code": "12010714",
        "address1": "FORTAGS HUSVAGEN 124493 KAVLINGE SWEDEN ",
        "address2": " "
    },
    {
        "code": "12010715",
        "address1": "CASTANO PRIMO VIA SABOTINO 13 20022 (MI)",
        "address2": " "
    },
    {
        "code": "12010716",
        "address1": "OFFICE NO 2622 6 FIRST FLOOR LANE NO 1 AL RAHEEM COLONY NISHTER",
        "address2": " "
    },
    {
        "code": "12010717",
        "address1": "63 CROMWELL DRIVE SLOUGH SL 1 3NF",
        "address2": " "
    },
    {
        "code": "12010718",
        "address1": "LAKHAN PUR SQUARE, PASRUR ROAD, SIALKOT, 51310-PAKISTAN.",
        "address2": " "
    },
    {
        "code": "12010719",
        "address1": "FRUITS AND VEGETABLES MARKET DUBAI UAE",
        "address2": " "
    },
    {
        "code": "12010720",
        "address1": "WILLY-MESSERSCHMITT-STR.3 82024 TAUFKIRCHEN GERMANY",
        "address2": " "
    },
    {
        "code": "12010721",
        "address1": "DRY PORT GHONA ROAD NEAR 196 GHONA EAST FAISLABAD PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010722",
        "address1": "50 RUE D ANJOU 75008 PARIS FRANCE",
        "address2": " "
    },
    {
        "code": "12010723",
        "address1": "A MANGHOPIR ROAD SITE KARACHI PAKISTAN ",
        "address2": " "
    },
    {
        "code": "12010724",
        "address1": "304 WEY MOUTH DIX HILLS NY 11746 USA",
        "address2": " "
    },
    {
        "code": "12010725",
        "address1": "51 ROGERS ROAD BIRMINGHAM BB 2JJ UK",
        "address2": " "
    },
    {
        "code": "12010726",
        "address1": "SUITE 505, PROGRESSIVE SQUARE, PLOT 11-A, BLOCK-6, PECHS, SHAHRAH-E-FAISAL,KARACHI - PAKISTAN.",
        "address2": " "
    },
    {
        "code": "12010727",
        "address1": "UNITED B24 25 NEW SMITHFILED MARKET MANCHESTER M11 2WW UK ",
        "address2": " "
    },
    {
        "code": "12010728",
        "address1": "PLOT C-20 AL HABIB SOCIETY SUPER HIGHWAY ROAD KARACHI",
        "address2": " "
    },
    {
        "code": "12010729",
        "address1": "C 124 G2 BLOCK NO 15 GULISTAN E JOHAR KARACHI",
        "address2": " "
    },
    {
        "code": "12010730",
        "address1": "4 ISLAY GARDENS HOUNSLOW TW4 5DR LONDON PR2 1AU ",
        "address2": " "
    },
    {
        "code": "12010731",
        "address1": "VILLA 249 STREET 76 SECTOR F11/1 ISLAMABAD 715123 PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010732",
        "address1": "UNITS 3 & 4 TINSLEY INDUSTRIAL ESTATE SHEPCOTE WAY SHEFFIELD SOUTH YORKSHIRE S9 1TH",
        "address2": " "
    },
    {
        "code": "12010733",
        "address1": "FLAT NO 105 BLOCK C CRYSTAL HILL APARTMRNT BATH ISLAND KARACHI",
        "address2": " "
    },
    {
        "code": "12010734",
        "address1": "FOR VEGETABLES AND FRUITS AL-SAFA DISTRICT JEDDAH",
        "address2": " "
    },
    {
        "code": "12010735",
        "address1": "3F-2 NO 142 SEC 3 MINQUAN E RD TAIPEI 10542 TAIWAN R O C",
        "address2": " "
    },
    {
        "code": "12010736",
        "address1": "C/O ASIA EXPRESS FOOD RONGOONWEG 7 1118 LP AMSTERDAM 1118",
        "address2": " "
    },
    {
        "code": "12010737",
        "address1": "USMAN GHANI ROAD BAN=GAMKOT SHAHDARA KARACHI",
        "address2": " "
    },
    {
        "code": "12010738",
        "address1": "CALLE ALTO GASPAR DEL HERO 15 ES-46380 CHESTE VALENCIA",
        "address2": " "
    },
    {
        "code": "12010739",
        "address1": "AM GRUNEM WEG 8 65451 KELSTERBAGH CHLAND FRANKFURT GERMANY",
        "address2": " "
    },
    {
        "code": "12010740",
        "address1": "GRONLAND 180188 OSLO",
        "address2": " "
    },
    {
        "code": "12010741",
        "address1": "GRONLAND 180188 OSLO",
        "address2": " "
    },
    {
        "code": "12010742",
        "address1": "41 43 UNION STREET ACCRINGTON LHR",
        "address2": " "
    },
    {
        "code": "12010743",
        "address1": "KARACHI,PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010744",
        "address1": "TAX REGISTRATION NUMBER 100002671400003 G2 007 SHARJAH AIRPORT INT'L FREE ZONE",
        "address2": " "
    },
    {
        "code": "12010745",
        "address1": "35 SUSSEX KEEP SLOUGH S11 1 NY LONDON ENGLAND C/O CARGO ALLIANCE EUROPE",
        "address2": " "
    },
    {
        "code": "12010746",
        "address1": "IQBAL TRADERS ORG NR 926194089 ENEBAKKVEIEN 172 RYEN 0680 OSLO",
        "address2": " "
    },
    {
        "code": "12010747",
        "address1": "H NO 3 SRH NO 2 BAZAR SHAKAR GARYAN NEAR FRUITS MANDI RAVI LINK ROAD ",
        "address2": " "
    },
    {
        "code": "12010748",
        "address1": "47 BOULEVARD DE LA MUETTE 95140 GARDEN LES GONESSE",
        "address2": " "
    },
    {
        "code": "12010749",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010750",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010751",
        "address1": "1000 NORTHBROOK PARKWAY  SUITE # D, SUWANEE, GA, 30024,info@gosaint.com/ 404.480.4440",
        "address2": " "
    },
    {
        "code": "12010752",
        "address1": "MANATEQ JER AL SAMUR LOGISTIC PARK UM SULAL ALI DOHA",
        "address2": " "
    },
    {
        "code": "12010753",
        "address1": "TEMA LUBE OIL CO. LTD. PRIVATE MAIL BAG, TEMA, GHANA",
        "address2": " "
    },
    {
        "code": "12010754",
        "address1": "SUITE 919 9TH FLR PLAZA II CHUNDRIGAR RD ",
        "address2": " "
    },
    {
        "code": "12010755",
        "address1": "PO BOX 90805 C R NO 174431 DOHA",
        "address2": " "
    },
    {
        "code": "12010756",
        "address1": "7 AGAVA STREET BRAMPTON ONTARIO L7 A4SS CANADA",
        "address2": " "
    },
    {
        "code": "12010757",
        "address1": "112542 PIETERLEN BE ZURICH",
        "address2": " "
    },
    {
        "code": "12010758",
        "address1": "SHAHRAH-E-FAISAL BRANCH, KARACHI-PAKISTAN.",
        "address2": " "
    },
    {
        "code": "12010759",
        "address1": "PLOT NO 7 SECTOR NO 7-A K I A KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010760",
        "address1": "CONTACT CONSULATE UZAIR MAHMOOD",
        "address2": " "
    },
    {
        "code": "12010761",
        "address1": "NOUL MORE RORAS ROAD SIALKOT 51310 PUNJAB PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010762",
        "address1": "PONIENTE 3 MZ 51 LT 20 COL CUCHILLA DEL TESORO CDMX CP 07900 MEXICO",
        "address2": " "
    },
    {
        "code": "12010763",
        "address1": "BEDWAS HOUSE INDUSTRIAL ESTATE 2 GREENWAY BEDWAS/CAERPHILLY CF83 8GF UK ATTN JAMES HUGHES",
        "address2": " "
    },
    {
        "code": "12010764",
        "address1": "BLK 668 CHANDER ROAD 02-08-20668 SINGAPORE",
        "address2": " "
    },
    {
        "code": "12010765",
        "address1": "1-KM AIMNA ABAD ROAD SIALKOT-51310, PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010766",
        "address1": "AM GRUNEN WEG 8 65451 KELSTERBACH FRANKFURT",
        "address2": " "
    },
    {
        "code": "12010767",
        "address1": "SAIF ZONE T5 055 SHARJAH UAE P O BOX 513756 MR HASAN",
        "address2": " "
    },
    {
        "code": "12010768",
        "address1": "NW 46 STREET MIAMI FL 33166 USA GUSTAVO OSPINA LOGISTICS MANAGER",
        "address2": " "
    },
    {
        "code": "12010769",
        "address1": "",
        "address2": " "
    },
    {
        "code": "12010770",
        "address1": "FOR BAKRIES AND MARKETING DINDAWOOD GROUP ELDING MADINA RD JEDDAH",
        "address2": " "
    },
    {
        "code": "12010771",
        "address1": "FOR BAKRIES AND MARKETING DINDAWOOD GROUP ELDING MADINA JEDDAH",
        "address2": " "
    },
    {
        "code": "12010772",
        "address1": "OFFICE 2# 1ST FLOOR ZAFAR NADEEM PLAZA MAIN BOUEVORD FAISAL TOWN PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010773",
        "address1": "776 A 41 / 2 MILE JALAN IPOH 51200 KUALA LUMPUR WILAYAH PERSEKUUAN MALAYSIA",
        "address2": " "
    },
    {
        "code": "12010774",
        "address1": "OFFICE NO:26, 3RD FLOOR, KOHINOOR ONE, KOHINOOR CITY, JARRANWALA ROAD,",
        "address2": "FAISALABAD,PAKISTAN "
    },
    {
        "code": "12010775",
        "address1": "Büyükkayacık OSB Mah 21 nolu sokak no1 42250 Selçuklu/KONYA ",
        "address2": " "
    },
    {
        "code": "12010776",
        "address1": "SHOP # 31-32 BLOCK DA NEW FRUIT MANDI SUPPERHIGHWAY KARACHI PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010777",
        "address1": "OTTO-HAHN-STR. 10 25337 ELMSHORN GERMANY",
        "address2": " "
    },
    {
        "code": "12010778",
        "address1": "VELEXA LOGISTICS BV SOHRAB 4 1118 DS SOHIPEOL AMSTERDAM",
        "address2": " "
    },
    {
        "code": "12010779",
        "address1": "MARC LAUGE 12D IST FLOOR NORTH  KARACHI",
        "address2": " "
    },
    {
        "code": "12010780",
        "address1": "JL . AGUNG NIAGA 1 BLOK G-2 NO. 12-13 RT.011 RW.13, SUNTER AGUNG, TANJUNG PRIOK,JAKARTA UTARA , DKI JAKARTA 14350, INDONESIA.NPWP : 02.450.851.7-048.000",
        "address2": " "
    },
    {
        "code": "12010781",
        "address1": "PLOT NO # 1,2,3,6,7,8 SECTOR E-VI, PHASE II KARACHI EXPORT PROCESSING ZONE ",
        "address2": "AUTHORITY, LANDHI INDUSTRIAL AREA, KARACHI PAKISTAN "
    },
    {
        "code": "12010782",
        "address1": "KARACHI-PAKISTAN",
        "address2": " "
    },
    {
        "code": "12010783",
        "address1": "6/F Asahi Building",
        "address2": "7-17 Nihonbashi Kodemmacho Chuo-Ku, Tokyo 103-0001, Japan  "
    },
    {
        "code": "12010784",
        "address1": "136 CHAPMAN STREET LONDON EI LONDON UK",
        "address2": " "
    },
    {
        "code": "12010785",
        "address1": "AL HASHEMIYAH INDUSTRIAL ZONE ZARKA JORDAN",
        "address2": " "
    },
    {
        "code": "12010786",
        "address1": "57A QUEEN ROAD LONDON E17 8QR UK",
        "address2": " "
    },
    {
        "code": "12010787",
        "address1": "DEVIN 68 1012 LUSSANE GENEVA SWIZERLAND",
        "address2": " "
    },
    {
        "code": "12010788",
        "address1": "ZURICH SWEITZERLAND",
        "address2": " "
    },
    {
        "code": "12010789",
        "address1": "WILLEM BROCADESDREEF 4 2132 PV HOOFDDORP THE NETHERLANDS",
        "address2": " "
    },
    {
        "code": "12010790",
        "address1": "OFFICE M 48 AL HABIB BUILDING AL AWEER FRUITS AND VEGETABLES MARKET DUBAI",
        "address2": " "
    },
    {
        "code": "12010791",
        "address1": "UNIT P26-27 WESTERN INTERNATIONAL MARKET HAYES ROAD",
        "address2": " "
    },
    {
        "code": "12010792",
        "address1": "31 / 195 PROSPECT HIGHWAY SEVEN HILLS, NSW 2147, AUSTRALIA.",
        "address2": " "
    },
    {
        "code": "12010793",
        "address1": "BRAUNFELSER STR 8-12 D-35638 LEUN GERMANY",
        "address2": " "
    },
    {
        "code": "12010794",
        "address1": "BRESLAUER STR. 14 D-37154 NORTHEIM,GERMANY",
        "address2": " "
    },
    {
        "code": "12010795",
        "address1": "P O BOX 90805 C R NO 174431 DOHA QATAR",
        "address2": " "
    },
    {
        "code": "12010796",
        "address1": "No.5  Haijiamingdi Building ,Qianjin west road ,Kunshan City ,Jiangsu Province, ",
        "address2": " "
    },
    {
        "code": "12010797",
        "address1": "POLT NO D44 DMJ GOTH SABZI KARACHI",
        "address2": " "
    },
    {
        "code": "12010798",
        "address1": "CR184138 DOHA",
        "address2": " "
    },
    {
        "code": "12010799",
        "address1": "10101 SW FREEWAY STE # 200 HOUSTON TX-77074 USA",
        "address2": " "
    },
    {
        "code": "12010800",
        "address1": "H NO D2/800 DOST MUHAMMAD JUNJHAR GOTH KARACHI",
        "address2": " "
    },
    {
        "code": "12010801",
        "address1": "CITY TOWER 6K MAIN BOULEVARD GULBERG-II LAHORE PAKISTAN.",
        "address2": " "
    },
    {
        "code": "12010802",
        "address1": "197 RUE DU FAUBORG SAINT DENIS 75010 PARIS FRANCE",
        "address2": " "
    },
    {
        "code": "12010803",
        "address1": "18 STANLEY RISE CM 26 PI SPRINGFIELD CHELMSFORD UNITED KINGDOM",
        "address2": " "
    },
    {
        "code": "12010804",
        "address1": "40-L BLOCK MODEL TOWN, LAHORE, PAKISTAN,",
        "address2": " "
    },
    {
        "code": "12010805",
        "address1": "The Gateway, Harbour City, 9 Canton Road, Tsim Sha Tsui, Kowloon, Hong Kong",
        "address2": " "
    },
    {
        "code": "12010806",
        "address1": "DUBAI UNITED ARAB EIRATES",
        "address2": " "
    },
    {
        "code": "12010807",
        "address1": "SUITE 3 SECOND FLOOR 760 EASTERN AVENUE NEWBURY PARK ILFORD GREATER LONDON",
        "address2": " "
    },
    {
        "code": "12010808",
        "address1": "UNIT NGFS WESTERN INTERNATIONAL MARKET HAYES ROAD LONDON",
        "address2": " "
    },
    {
        "code": "12010809",
        "address1": "147 STAFFORD ROAD CROYDON CRO 4NN C/O AAA FREIGHT SERVICES LTD UNIT 2/3 48 GEORGE STREET GLASGOW",
        "address2": " "
    },
    {
        "code": "12010810",
        "address1": "KM 3.5 AUTOPISTA BOGOTA MEDELIN TERMINAL TERRESTRE DE CARGA DE BOGOTA",
        "address2": " "
    },
    {
        "code": "12010811",
        "address1": "BICKLAND WATER ROAD FALMOUTH TR11 4RU UNITED KINGDOM",
        "address2": " "
    },
    {
        "code": "12010812",
        "address1": "27 Q CCA 1ST FLOOR DHA PHASE 7 LAHORE, PAKISTAN. ",
        "address2": " "
    },
    {
        "code": "12010813",
        "address1": "402-A 4TH FLOOR BIHAYANI CENTER BLOCK M NORTH NAZIMABAD KARACHI",
        "address2": " "
    },
    {
        "code": "12010814",
        "address1": "CORP CENTEAL  STE 160 75080 DALLAS TX USA ",
        "address2": " "
    },
    {
        "code": "12010815",
        "address1": "TANNERY STREET,TIBBI ARAYAN AIRPORT ROAD 51310 SIALKOT (PAKISTAN)",
        "address2": " "
    },
    {
        "code": "12010816",
        "address1": "PLOT 4 AND SECTOR 25 KORANGI INDUSTRIAL AREA KARACHI",
        "address2": " "
    },
    {
        "code": "12010817",
        "address1": "440 BORDESLEY GREEN BIRMINGHAM B9 5NE ",
        "address2": " "
    },
    {
        "code": "12010818",
        "address1": "INTERNATIONAL MARKET HAYES ROAD SOUTHALL MIDLESEX UB2 5 XJ",
        "address2": " "
    },
    {
        "code": "12010819",
        "address1": "327 A HIGH STREET SLOUGH SL1 1TX",
        "address2": " "
    }
  ]

  const companyId = useSelector((state) => state.company.value);
  
  useEffect(() => {
    if(sessionData.isLoggedIn==false){
      Router.push('/login')
    }

  }, [sessionData]);

  return (
    <div className='base-page-layout'>
      <Row>
        {companyId==3 && <AWBCalculator/>}
        {companyId!=3 && 
          <div>
            <>
                {/* 
                <>
                Account List Importer
                <hr/>
                <CSVReader 
                    onFileLoaded={async(data, fileInfo, originalFile) => {
                        let parentAccounts = [];
                        let tempAccounts = [];
                        await data.forEach((x,i)=>{
                            if(i<1590){
                                tempAccounts.push({
                                    code:x[0]?.trim(),
                                    title:x[2]?.trim(),
                                    account:x[4]?.trim(),
                                    group:x[3]?.trim(),
                                    subCategory:x[5]?.trim()
                                })
                            }else{
                                return;
                            }
                        })
                        tempAccounts.forEach((x)=>{
                            if(x.group=="Group" ){
                                parentAccounts.push({
                                    title:x.title,
                                    editable:"1",
                                    CompanyId:1,
                                    subCategory:x.subCategory,
                                    AccountId:
                                        x.account=="Asset"?
                                        3:
                                        x.account=="Liability"?
                                        4:
                                        x.account=="Expense"?
                                        1:
                                        x.account=="Income"?
                                        2:5,
                                    childs:[],
                                })
                            }else if(x.group!="Group" && parentAccounts.length>0){
                                parentAccounts[parentAccounts.length-1].childs.push({
                                    title:x.title,
                                    subCategory:x.subCategory,
                                    editable:"1"
                                });
                            }
                        })
                        console.log(parentAccounts);
                    }}
                />
                </> 
                */}
            </>

            <>
            {/* 
            <>
            Client List Importer
            <hr/>
            <CSVReader 
              onFileLoaded={async(data, fileInfo, originalFile) => {
                let parentAccounts = [];
                let tempAccounts = [];
                await data.forEach((x,i) => {
                  if(i<2517 && i>0 && (x[0]=='1'||x[0]=='3')){
                    tempAccounts.push({
                      PartyTypeId:x[0]?.trim(),
                      code:x[2]?.trim(),
                      name:x[3]?.trim(),
                      person1:x[5]?.trim(),
                      zip:x[7]?.trim(),
                      telephone1:x[8],
                      telephone2:x[9],
                      mobile1:x[11],
                      mobile2:x[10],
                      infoMail:x[12],
                      website:x[13],
                      operations:`${x[33]}, ${x[34]}, ${x[35]}, ${x[36]}`,
                      types:`${x[17]}, ${x[18]}, ${x[19]}, ${x[26]}`,
                      //types:`${x[20]}, ${x[21]}, ${x[22]}, ${x[24]}, ${x[25]}, ${x[27]}, ${x[28]}, ${x[29]}, ${x[30]}, ${x[31]}, ${x[32]}`,
                    });
                  } else {
                    return;
                  }
                })
                let newTemp = [...tempAccounts];
                await newTemp.forEach((x, i) => {
                  let tempAr = [];
                  let tempTypeAr = [];
                  tempAr = x.operations.split(", ");
                  tempTypeAr = x.types.split(", ");

                  let tempOperation = '';
                  let tempTypes = '';

                  tempOperation = tempAr[0]=='1'?'Sea Export':'';
                  tempOperation = `${tempOperation}${((tempAr[0]=='1')&&tempAr[1]=='1')?', ':''}`;
                  tempOperation = `${tempOperation}${tempAr[1]=='1'?'Sea Import':''}`;
                  tempOperation = `${tempOperation}${((tempAr[0]=='1'||tempAr[1]=='1')&&(tempAr[2]=='1'))?', ':''}`;
                  tempOperation = `${tempOperation}${tempAr[2]=='1'?'Air Export':''}`;
                  tempOperation = `${tempOperation}${((tempAr[0]=='1'||tempAr[1]=='1'||tempAr[2]=='1')&&tempAr[3]=='1')?', ':''}`;
                  tempOperation = `${tempOperation}${tempAr[3]=='1'?'Air Import':''}`;
                  x.operations = tempOperation;
                  
                  tempTypes = tempTypeAr[0]=='1'?'Shipper':''
                  tempTypes = `${tempTypes}${((tempTypeAr[0]=='1')&&tempTypeAr[1]=='1')?', ':''}`;
                  tempTypes = `${tempTypes}${tempTypeAr[1]=='1'?'Consignee':''}`;
                  tempTypes = `${tempTypes}${((tempTypeAr[0]=='1'||tempTypeAr[1]=='1')&&tempTypeAr[2]=='1')?', ':''}`;
                  tempTypes = `${tempTypes}${tempTypeAr[2]=='1'?'Notify':''}`;
                  tempTypes = `${tempTypes}${((tempTypeAr[0]=='1'||tempTypeAr[1]=='1'||tempTypeAr[2]=='1')&&tempTypeAr[3]=='1')?', ':''}`;
                  tempTypes = `${tempTypes}${tempTypeAr[3]=='1'?'Potential Customer':''}`;
                  tempTypes = `${tempTypes}${((tempTypeAr[0]=='1'||tempTypeAr[1]=='1'||tempTypeAr[2]=='1'||tempTypeAr[3]=='1')&&tempTypeAr[4]=='1')?', ':''}`;
                  tempTypes = `${tempTypes}${tempTypeAr[4]=='1'?'Invoice Party':''}`;
                  tempTypes = `${tempTypes}${((tempTypeAr[0]=='1'||tempTypeAr[1]=='1'||tempTypeAr[2]=='1'||tempTypeAr[3]=='1'||tempTypeAr[4]=='1')&&tempTypeAr[5]=='1')?', ':''}`;
                  tempTypes = `${tempTypes}${tempTypeAr[4]=='1'?'Non operational Party':''}`;
                  x.types = tempTypes;
                })
                newTemp = newTemp.filter((x)=>{return x.types!=''});
                console.log(newTemp);
              }}
            />
            </>  
            */}
            </>
           
           <>
            {/* Parties List Importer
            <hr/>
            <CSVReader 
              onFileLoaded={async(data, fileInfo, originalFile) => {
                let parentAccounts = [];
                let tempAccounts = [];
                await data.forEach((x,i) => {
                  if(i<2517 && i>0 && (x[0]=='2'||x[0]=='3')){
                    tempAccounts.push({
                      PartyTypeId:x[0]?.trim(),
                      code:x[2]?.trim(),
                      name:x[3]?.trim(),
                      person1:x[4]?.trim(),
                      zip:x[6]?.trim(),
                      telephone1:x[7],
                      telephone2:x[8],
                      mobile1:x[10],
                      mobile2:x[9],
                      infoMail:x[11],
                      website:x[12],
                      operations:`${x[34]}, ${x[35]}, ${x[36]}, ${x[37]}, ${x[39]}`,
                      //types:`${x[16]}, ${x[17]}, ${x[18]}, ${x[19]}`,
                      types:`${x[20]}, ${x[21]}, ${x[22]}, ${x[23]}, ${x[24]}, ${x[25]}, ${x[26]}, ${x[27]}, ${x[28]}, ${x[29]}, ${x[30]}, ${x[31]}, ${x[32]}, ${x[33]}`,
                    });
                  } else {
                    return;
                  }
                })
                let newTemp = [...tempAccounts];
                await newTemp.forEach((x, i) => {
                  let tempAr = [];
                  let tempTypeAr = [];
                  tempAr = x.operations.split(", ");
                  tempTypeAr = x.types.split(", ");

                  let tempOperation = '';
                  let tempTypes = '';

                  tempOperation = tempAr[0]=='1'?'Sea Export':'';
                  tempOperation = `${tempOperation}${(tempOperation.length>1&& tempAr[1]=='1') ?', ':''}${tempAr[1]=='1'?'Sea Import':''}`;
                  tempOperation = `${tempOperation}${(tempOperation.length>1&& tempAr[2]=='1') ?', ':''}${tempAr[2]=='1'?'Air Export':''}`;
                  tempOperation = `${tempOperation}${(tempOperation.length>1&& tempAr[3]=='1') ?', ':''}${tempAr[3]=='1'?'Air Import':''}`;
                  tempOperation = `${tempOperation}${(tempOperation.length>1&& tempAr[4]=='1') ?', ':''}${tempAr[4]=='1'?'Logistic':''}`;
                  x.operations = tempOperation;
                  
                  
                //   tempTypes = tempTypeAr[0]=='1'?'Shipper':''
                //   tempTypes = `${tempTypes}${(tempTypes.length>1&& tempTypeAr[1]=='1') ?', ':''}${tempTypeAr[1]=='1'?'Consignee':''}`;
                //   tempTypes = `${tempTypes}${(tempTypes.length>1&& tempTypeAr[2]=='1') ?', ':''}${tempTypeAr[2]=='1'?'Notify':''}`;
                //   tempTypes = `${tempTypes}${(tempTypes.length>1&& tempTypeAr[3]=='1') ?', ':''}${tempTypeAr[3]=='1'?'Potential Customer':''}`;
                
                
                  tempTypes = tempTypeAr[0]=='1'?'Forwarder/Coloader':''
                  tempTypes = `${tempTypes}${(tempTypes.length>1&& tempTypeAr[1]=='1') ?', ':''}${tempTypeAr[1]=='1'?'Local Vendor':''}`;
                  tempTypes = `${tempTypes}${(tempTypes.length>1&& tempTypeAr[2]=='1') ?', ':''}${tempTypeAr[2]=='1'?'Overseas Agent':''}`;
                  tempTypes = `${tempTypes}${(tempTypes.length>1&& tempTypeAr[3]=='1') ?', ':''}${tempTypeAr[3]=='1'?'Commission Agent':''}`;
                  tempTypes = `${tempTypes}${(tempTypes.length>1&& tempTypeAr[4]=='1') ?', ':''}${tempTypeAr[4]=='1'?'Indentor':''}`;
                  tempTypes = `${tempTypes}${(tempTypes.length>1&& tempTypeAr[5]=='1') ?', ':''}${tempTypeAr[5]=='1'?'Transporter':''}`;
                  tempTypes = `${tempTypes}${(tempTypes.length>1&& tempTypeAr[6]=='1') ?', ':''}${tempTypeAr[6]=='1'?'CHA/CHB':''}`;
                  tempTypes = `${tempTypes}${(tempTypes.length>1&& tempTypeAr[7]=='1') ?', ':''}${tempTypeAr[7]=='1'?'Shipping Line':''}`;
                  tempTypes = `${tempTypes}${(tempTypes.length>1&& tempTypeAr[8]=='1') ?', ':''}${tempTypeAr[8]=='1'?'Delivery Agent':''}`;
                  tempTypes = `${tempTypes}${(tempTypes.length>1&& tempTypeAr[9]=='1') ?', ':''}${tempTypeAr[9]=='1'?'Warehouse':''}`;
                  tempTypes = `${tempTypes}${(tempTypes.length>1&&tempTypeAr[10]=='1') ?', ':''}${tempTypeAr[10]=='1'?'Air Line':''}`;
                  tempTypes = `${tempTypes}${(tempTypes.length>1&&tempTypeAr[11]=='1') ?', ':''}${tempTypeAr[11]=='1'?'Trucking':''}`;
                  tempTypes = `${tempTypes}${(tempTypes.length>1&&tempTypeAr[12]=='1') ?', ':''}${tempTypeAr[12]=='1'?'Logistic':''}`;
                  tempTypes = `${tempTypes}${(tempTypes.length>1&&tempTypeAr[12]=='1') ?', ':''}${tempTypeAr[12]=='1'?'Import Nomination':''}`;
                  tempTypes = `${tempTypes}${(tempTypes.length>1&&tempTypeAr[13]=='1') ?', ':''}${tempTypeAr[13]=='1'?'Export Nomination':''}`;

                  x.types = tempTypes;
                })
                newTemp = newTemp.filter((x)=>{return x.types!=''});
                newTemp.forEach((x, i) => {
                    addresses.forEach((y)=>{
                        if(x.code==y.code){
                            newTemp[i].address1=y.address1;
                            newTemp[i].address2=y.address2;
                        }
                    })
                })
                console.log(newTemp)
                // newTemp.forEach((x) => {
                //     console.log(`${x.code} -> ${x.types}`)
                // })
              }}
            /> */}
            </> 
          </div>
        }
      </Row>
    </div>
  )
}

export default Main