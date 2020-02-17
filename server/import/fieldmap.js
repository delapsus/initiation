
let fieldMap = {

    root: [
        {key:"Tracking Number", type:"string", db:"trackingNumber"},
        {key:"Creation Date", type:"date", db:"createdDate"},
        {key:"Name First", type:"string", db:"firstName"},
        {key:"Name Middle", type:"string", db:"middleName"},
        {key:"Name Last", type:"string", db:"lastName"},

        {key:"Magickal Motto Present", type:"string", db:"motto"},
        {key:"Magickal Motto Old", type:"string", db:"mottoOld"},
        {key:"Motto Comment", type:"string", db:"mottoComment"},
        {key:"AKA's", type:"string", db:"aliases"},
        {key:"Address Comments", type:"string", db:"addressComments"},
        {key:"Address Perm", type:"string", db:"primaryAddress"},
        {key:"Address 2 Perm", type:"string", db:"primaryAddress2"},
        {key:"City Perm", type:"string", db:"primaryCity"},
        {key:"Principality Perm", type:"string", db:"primaryPrincipality"},
        {key:"Zip Perm", type:"string", db:"primaryZip"},
        {key:"Country Perm", type:"string", db:"primaryCountry"},
        {key:"Address Mail", type:"string", db:"mailAddress"},
        {key:"Address Mail 2", type:"string", db:"mailAddress2"},
        {key:"City Mail", type:"string", db:"mailCity"},
        {key:"Principality Mail", type:"string", db:"mailPrincipality"},
        {key:"Zip Mail", type:"string", db:"mailZip"},
        {key:"Country Mail", type:"string", db:"mailCountry"},
        {key:"Address Other", type:"string", db:"otherAddress"},
        {key:"Address Other 2", type:"string", db:"otherAddress2"},
        {key:"City Other", type:"string", db:"otherCity"},
        {key:"Zip Other", type:"string", db:"otherZip"},
        {key:"Principality Other", type:"string", db:"otherPrincipality"},
        {key:"Country Other", type:"string", db:"otherCountry"},
        {key:"Phone Comments", type:"string", db:"phoneComments"},
        {key:"Phone Main", type:"string", db:"phoneMain"},
        {key:"Phone Main 2", type:"string", db:"phoneMain2"},
        {key:"Phone Work", type:"string", db:"phoneWork"},
        {key:"Phone Emergency", type:"string", db:"phoneEmergency"},
        {key:"Fax", type:"string", db:"fax"},
        {key:"Modem", type:"string", db:"email"},
        {key:"Birth City", type:"string", db:"birthCity"},
        {key:"Birth Cntry First", type:"string", db:"birthCountryFirst"},
        {key:"Birth Cntry Minerval", type:"string", db:"birthCountryMinerval"},
        {key:"Birth Principality", type:"string", db:"birthPrincipality"},
        {key:"Birth Date", type:"date", db:"birthDate"},
        {key:"Birth Time", type:"string", db:"birthTime"},
        {key:"Body of Responsibility", type:"string", db:"bodyOfResponsibility"},
        {key:"Misc Comments", type:"string", db:"comments"},
        {key:"Difficulties Comments", type:"string", db:"difficultiesComments"},
        {key:"Difficulty", type:"boolean", db:"difficulty"},
        {key:"Master", type:"boolean", db:"isMaster"},
        {key:"Master of Body", type:"string", db:"masterOfBody"},
        {key:"Report Comment", type:"string", db:"reportComment"},
        {key:"Felon", type:"boolean", db:"isFelon"},
        {key:"Report.Dues", type:"boolean", db:"isDuesInactive"},
        {key:"Report.International Bad", type:"boolean", db:"isInternationalBadReport"},
        {key:"Report.Resigned", type:"boolean", db:"isResigned"}
    ],
    initiations: [
        {
            check: "Degree Minerval",
            degreeId: 1,
            fields: [
                {key:"Cert Out Minerval", type:"date", db:"certSentOutToBodyDate"},
                {key:"Cert. HB Minerval", type:"date", db:"certSentOutForSignatureDate"},
                {key:"Cert. Rec. Minerval", type:"date", db:"certReceivedDate"},
                {key:"Date Minerval Approved", type:"date", db:"approvedDate"},
                {key:"Date Minerval Reported", type:"date", db:"reportedDate"},
                {key:"Date Prop Minerval", type:"date", db:"proposedDate"},
                {key:"Date Rec Minerval", type:"date", db:"actualDate"},
                {key:"Rec On Minerval", type:"date", db:"signedDate"},
                {key:"L.O.C to Minerval", type:"string", db:"location"},
                {key:"Minerval 1 First", type:"string", db:"sponsor1First"},
                {key:"Minerval 1 Last", type:"string", db:"sponsor1Last"},
                {key:"Minerval 1 Middle", type:"string", db:"sponsor1Middle"},
                {key:"Minerval 2 First", type:"string", db:"sponsor2First"},
                {key:"Minerval 2 Last", type:"string", db:"sponsor2Last"},
                {key:"Minerval 2 Middle", type:"string", db:"sponsor2Middle"},
                {key:"Minerval Spnsr 1 Check", type:"boolean", db:"sponsor1Checked"},
                {key:"Minerval Spnsr 2 Check", type:"boolean", db:"sponsor2Checked"},
                {key:"LB Minerval", type:"string", db:"localBody"},
                {key:"LB Minerval Date", type:"date", db:"localBodyDate"},
                {type:"string", key: "Minerval Emir", db:"emirName"},
                {type:"string", key: "Minerval Init", db:"initiatorName"},
                {type:"string", key: "Init Phone Minerval", db:"initiatorPhone"}
            ]
        },
        {
            check: "Degree First",
            degreeId: 2,
            fields: [
                {key:"Cert Out First", type:"date", db:"certSentOutToBodyDate"},
                {key:"Cert. HB First", type:"date", db:"certSentOutForSignatureDate"},
                {key:"Cert. Rec. First", type:"date", db:"certReceivedDate"},
                {key:"Date First Approved", type:"date", db:"approvedDate"},
                {key:"Date First Reported", type:"date", db:"reportedDate"},
                {key:"Date Prop First", type:"date", db:"proposedDate"},
                {key:"Date Rec First", type:"date", db:"actualDate"},
                {key:"Rec On First", type:"date", db:"signedDate"},
                {key:"L.O.C to First", type:"string", db:"location"},
                {key:"First 1 First", type:"string", db:"sponsor1First"},
                {key:"First 1 Last", type:"string", db:"sponsor1Last"},
                {key:"First 1 Middle", type:"string", db:"sponsor1Middle"},
                {key:"First 2 First", type:"string", db:"sponsor2First"},
                {key:"First 2 Last", type:"string", db:"sponsor2Last"},
                {key:"First 2 Middle", type:"string", db:"sponsor2Middle"},
                {key:"First Spnsr 1 Check", type:"boolean", db:"sponsor1Checked"},
                {key:"First Spnsr 2 Check", type:"boolean", db:"sponsor2Checked"},
                {key:"LB First", type:"string", db:"localBody"},
                {key:"LB First Date", type:"date", db:"localBodyDate"},
                {type:"string", key: "First Emir", db:"emirName"},
                {type:"string", key: "First Wazir", db:"wazirName"},
                {type:"string", key: "First Init", db:"initiatorName"},
                {type:"string", key: "Init Phone First", db:"initiatorPhone"}
            ]
        },
        {
            check: "Degree Second",
            degreeId: 3,
            fields: [
                {key:"Cert Out Second", type:"date", db:"certSentOutToBodyDate"},
                {key:"Cert. HB Second", type:"date", db:"certSentOutForSignatureDate"},
                {key:"Cert. Rec. Second", type:"date", db:"certReceivedDate"},
                {key:"Date Second Approved", type:"date", db:"approvedDate"},
                {key:"Date Second Reported", type:"date", db:"reportedDate"},
                {key:"Date Prop Second", type:"date", db:"proposedDate"},
                {key:"Date Rec Second", type:"date", db:"actualDate"},
                {key:"Rec On Second", type:"date", db:"signedDate"},
                {key:"L.O.C to Second", type:"string", db:"location"},
                {key:"Second 1 First", type:"string", db:"sponsor1First"},
                {key:"Second 1 Last", type:"string", db:"sponsor1Last"},
                {key:"Second 1 Middle", type:"string", db:"sponsor1Middle"},
                {key:"Second 2 First", type:"string", db:"sponsor2First"},
                {key:"Second 2 Last", type:"string", db:"sponsor2Last"},
                {key:"Second 2 Middle", type:"string", db:"sponsor2Middle"},
                {key:"Second Spnsr 1 Check", type:"boolean", db:"sponsor1Checked"},
                {key:"Second Spnsr 2 Check", type:"boolean", db:"sponsor2Checked"},
                {key:"LB Second", type:"string", db:"localBody"},
                {key:"LB Second Date", type:"date", db:"localBodyDate"},
                {type:"string", key: "Second Emir", db:"emirName"},
                {type:"string", key: "Second Wazir", db:"wazirName"},
                {type:"string", key: "Second Init", db:"initiatorName"},
                {type:"string", key: "Init Phone Second", db:"initiatorPhone"}
            ]
        },
        {
            check: "Degree Third",
            degreeId: 4,
            fields: [
                {key:"Cert Out Third", type:"date", db:"certSentOutToBodyDate"},
                {key:"Cert. HB Third", type:"date", db:"certSentOutForSignatureDate"},
                {key:"Cert. Rec. Third", type:"date", db:"certReceivedDate"},
                {key:"Date Third Approved", type:"date", db:"approvedDate"},
                {key:"Date Third Reported", type:"date", db:"reportedDate"},
                {key:"Date Prop Third", type:"date", db:"proposedDate"},
                {key:"Date Rec Third", type:"date", db:"actualDate"},
                {key:"Rec On Third", type:"date", db:"signedDate"},
                {key:"L.O.C to Third", type:"string", db:"location"},
                {key:"Third 1 First", type:"string", db:"sponsor1First"},
                {key:"Third 1 Last", type:"string", db:"sponsor1Last"},
                {key:"Third 1 Middle", type:"string", db:"sponsor1Middle"},
                {key:"Third 2 First", type:"string", db:"sponsor2First"},
                {key:"Third 2 Last", type:"string", db:"sponsor2Last"},
                {key:"Third 2 Middle", type:"string", db:"sponsor2Middle"},
                {key:"Third Spnsr 1 Check", type:"boolean", db:"sponsor1Checked"},
                {key:"Third Spnsr 2 Check", type:"boolean", db:"sponsor2Checked"},
                {key:"LB Third", type:"string", db:"localBody"},
                {key:"LB Third Date", type:"date", db:"localBodyDate"},
                {type:"string", key: "Third Emir", db:"emirName"},
                {type:"string", key: "Third Wazir", db:"wazirName"},
                {type:"string", key: "Third Init", db:"initiatorName"},
                {type:"string", key: "Init Phone Third", db:"initiatorPhone"}
            ]
        },
        {
            check: "Degree Fourth",
            degreeId: 5,
            fields: [
                {key:"Cert Out Fourth", type:"date", db:"certSentOutToBodyDate"},
                {key:"Cert. HB Fourth", type:"date", db:"certSentOutForSignatureDate"},
                {key:"Cert. Rec. Fourth", type:"date", db:"certReceivedDate"},
                {key:"Date Fourth Approved", type:"date", db:"approvedDate"},
                {key:"Date Fourth Reported", type:"date", db:"reportedDate"},
                {key:"Date Prop Fourth", type:"date", db:"proposedDate"},
                {key:"Date Rec Fourth", type:"date", db:"actualDate"},
                {key:"Rec On Fourth", type:"date", db:"signedDate"},
                {key:"Lodge to Fourth", type:"string", db:"location"},
                {key:"Fourth 1 First", type:"string", db:"sponsor1First"},
                {key:"Fourth 1 Last", type:"string", db:"sponsor1Last"},
                {key:"Fourth 1 Middle", type:"string", db:"sponsor1Middle"},
                {key:"Fourth 2 First", type:"string", db:"sponsor2First"},
                {key:"Fourth 2 Last", type:"string", db:"sponsor2Last"},
                {key:"Fourth 2 Middle", type:"string", db:"sponsor2Middle"},
                {key:"Fourth Spnsr 1 Check", type:"boolean", db:"sponsor1Checked"},
                {key:"Fourth Spnsr 2 Check", type:"boolean", db:"sponsor2Checked"},
                {key:"LB Fourth", type:"string", db:"localBody"},
                {key:"LB Fourth Date", type:"date", db:"localBodyDate"},

                {type:"string", key: "Init Phone Fourth", db:"initiatorPhone"},
                {type:"string", key: "Zerrubbabel", db:"zerrubbabelName"},
                {type:"string", key: "Haggai", db:"haggaiName"},
                {type:"string", key: "Joshua", db:"joshuaName"},
                {type:"string", key: "Herald", db:"heraldName"},
                {type:"string", key: "S.P.M.", db:"seniorPerfectMagicianName"},
                {type:"string", key: "FourthTestScore", db:"testScore"}
            ]
        },
        {
            check: "Degree P.I.",
            degreeId: 6,
            fields: [
                {key:"Cert Out P.I.", type:"date", db:"certSentOutToBodyDate"},
                {key:"Cert. HB P.I.", type:"date", db:"certSentOutForSignatureDate"},
                {key:"Cert. Rec. P.I.", type:"date", db:"certReceivedDate"},
                {key:"Date PI Approved", type:"date", db:"approvedDate"},
                {key:"Date P.I. Reported", type:"date", db:"reportedDate"},
                {key:"Date Prop P.I.", type:"date", db:"proposedDate"},
                {key:"Date Rec P.I.", type:"date", db:"actualDate"},
                {key:"Rec On PI", type:"date", db:"signedDate"},
                {key:"Lodge to P.I.", type:"string", db:"location"},
                {key:"PI 1 First", type:"string", db:"sponsor1First"},
                {key:"PI 1 Last", type:"string", db:"sponsor1Last"},
                {key:"PI 1 Middle", type:"string", db:"sponsor1Middle"},
                {key:"PI 2 First", type:"string", db:"sponsor2First"},
                {key:"PI 2 Last", type:"string", db:"sponsor2Last"},
                {key:"PI 2 Middle", type:"string", db:"sponsor2Middle"},
                {key:"P I Spnsr 1 Check", type:"boolean", db:"sponsor1Checked"},
                {key:"P I Spnsr 2 Check", type:"boolean", db:"sponsor2Checked"},
                {key:"LB PI", type:"string", db:"localBody"},
                {key:"LB PI Date 2", type:"date", db:"localBodyDate"},

                {type:"string", key: "Init Phone P.I.", db:"initiatorPhone"},
                {type:"string", key: "Zerrubbabel PI", db:"zerrubbabelName"},
                {type:"string", key: "Haggai PI", db:"haggaiName"},
                {type:"string", key: "Joshua PI", db:"joshuaName"},
                {type:"string", key: "Herald PI", db:"heraldName"},
                {type:"string", key: "S.P.M. PI", db:"seniorPerfectMagicianName"}
            ]
        },
        {
            check: "Degree K.E.W.",
            degreeId: 7,
            fields: [
                {key:"Cert Out K.E.W.", type:"date", db:"certSentOutToBodyDate"},
                {key:"Cert. HB K.E.W.", type:"date", db:"certSentOutForSignatureDate"},
                {key:"Cert. Rec. K.E.W.", type:"date", db:"certReceivedDate"},
                //{key:"Date PI Approved", type:"date", db:"approvedDate"},
                {key:"Date K.E.W. Reported", type:"date", db:"reportedDate"},
                //{key:"Date Prop P.I.", type:"date", db:"proposedDate"},
                {key:"Date Rec K.E.W.", type:"date", db:"actualDate"},
                {key:"Rec On KEW", type:"date", db:"signedDate"},
                {key:"Location of KEW", type:"string", db:"location"},

                // none of these have any data
                {key:"KEW 1 First", type:"string", db:"sponsor1First"},
                {key:"KEW 1 Last", type:"string", db:"sponsor1Last"},
                {key:"KEW 1 Middle", type:"string", db:"sponsor1Middle"},
                {key:"KEW 2 First", type:"string", db:"sponsor2First"},
                {key:"KEW 2 Last", type:"string", db:"sponsor2Last"},
                {key:"KEW 2 Middle", type:"string", db:"sponsor2Middle"},
                {key:"K E W Spnsr 1 Check", type:"boolean", db:"sponsor1Checked"},
                {key:"K E W Spnsr 2 Check", type:"boolean", db:"sponsor2Checked"},
                //{key:"LB PI", type:"string", db:"localBody"},
                //{key:"LB PI Date 2", type:"date", db:"localBodyDate"},

                //{type:"string", key: "Init Phone P.I.", db:"initiatorPhone"},
                {type:"string", key: "KEW Initiator", db:"initiatorName"},
                {type:"string", key: "KEW Assistant1", db:"assistant1Name"},
                {type:"string", key: "KEW Assistant2", db:"assistant2Name"}
            ]
        },
        {
            check: "Degree Fifth",
            degreeId: 8,
            fields: [
                {key:"Cert Out Fifth", type:"date", db:"certSentOutToBodyDate"},
                {key:"Cert. HB Fifth", type:"date", db:"certSentOutForSignatureDate"},
                {key:"Cert. Rec. Fifth", type:"date", db:"certReceivedDate"},
                {key:"Date Fifth Reported", type:"date", db:"reportedDate"},
                {key:"Date Rec Fifth", type:"date", db:"actualDate"},
                {key:"Rec On Fifth", type:"date", db:"signedDate"},
                {key:"Location of Fifth", type:"string", db:"location"},

                {key:"Fifth 1 First", type:"string", db:"sponsor1First"},
                {key:"Fifth 1 Last", type:"string", db:"sponsor1Last"},
                {key:"Fifth 1 Middle", type:"string", db:"sponsor1Middle"},
                {key:"Fifth 2 First", type:"string", db:"sponsor2First"},
                {key:"Fifth 2 Last", type:"string", db:"sponsor2Last"},
                {key:"Fifth 2 Middle", type:"string", db:"sponsor2Middle"},
                {key:"Fifth Spnsr 1 Check", type:"boolean", db:"sponsor1Checked"},
                {key:"Fifth Spnsr 2 Check", type:"boolean", db:"sponsor2Checked"},

                {type:"string", key: "Fifth MWS", db:"mostWiseSovereign"},
                {type:"string", key: "Fifth HP", db:"highPriestess"},
                {type:"string", key: "Fifth GM", db:"grandMarshal"}
            ]
        },
        {
            check: "Degree K.R.E.",
            degreeId: 9,
            fields: [
                {key:"Cert Out K.R.E.", type:"date", db:"certSentOutToBodyDate"},
                {key:"Cert. HB K.R.E.", type:"date", db:"certSentOutForSignatureDate"},
                {key:"Cert. Rec. K.R.E.", type:"date", db:"certReceivedDate"},
                {key:"Date K.R.E. Reported", type:"date", db:"reportedDate"},
                {key:"Date Rec K.R.E.", type:"date", db:"actualDate"},
                {key:"Rec On KRE", type:"date", db:"signedDate"},
                {key:"Location of KRE", type:"string", db:"location"},

                {key:"KRE 1 First", type:"string", db:"sponsor1First"},
                {key:"KRE 1 Last", type:"string", db:"sponsor1Last"},
                {key:"KRE 1 Middle", type:"string", db:"sponsor1Middle"},
                {key:"KRE 2 First", type:"string", db:"sponsor2First"},
                {key:"KRE 2 Last", type:"string", db:"sponsor2Last"},
                {key:"KRE 2 Middle", type:"string", db:"sponsor2Middle"},
                {key:"K R E Spnsr 1 Check", type:"boolean", db:"sponsor1Checked"},
                {key:"K R E Spnsr 2 Check", type:"boolean", db:"sponsor2Checked"},

                {type:"string", key: "KRE Initiator", db:"initiatorName"},
                {type:"string", key: "KRE Assistant1", db:"assistant1Name"},
                {type:"string", key: "KRE Assistant2", db:"assistant2Name"}
            ]
        },
        {
            check: "Degree Sixth",
            degreeId: 10,
            fields: [
                {key:"Cert Out Sixth", type:"date", db:"certSentOutToBodyDate"},
                {key:"Cert. HB Sixth", type:"date", db:"certSentOutForSignatureDate"},
                {key:"Cert. Rec. Sixth", type:"date", db:"certReceivedDate"},
                {key:"Date Sixth Reported", type:"date", db:"reportedDate"},
                {key:"Date Rec Sixth", type:"date", db:"actualDate"},
                {key:"Rec On Sixth", type:"date", db:"signedDate"},
                {key:"Location of Sixth", type:"string", db:"location"},

                // none of these have any data
                {key:"Sixth 1 First", type:"string", db:"sponsor1First"},
                {key:"Sixth 1 Last", type:"string", db:"sponsor1Last"},
                {key:"Sixth 1 Middle", type:"string", db:"sponsor1Middle"},
                {key:"Sixth 2 First", type:"string", db:"sponsor2First"},
                {key:"Sixth 2 Last", type:"string", db:"sponsor2Last"},
                {key:"Sixth 2 Middle", type:"string", db:"sponsor2Middle"},
                {key:"Sixth Spnsr 1 Check", type:"boolean", db:"sponsor1Checked"},
                {key:"Sixth Spnsr 2 Check", type:"boolean", db:"sponsor2Checked"}
            ]
        },

        {
            check: "Degree G.I.C.",
            degreeId: 11,
            fields: [
                {key:"Cert Out G.I.C.", type:"date", db:"certSentOutToBodyDate"},
                {key:"Cert. HB G.I.C.", type:"date", db:"certSentOutForSignatureDate"},
                {key:"Cert. Rec. G.I.C.", type:"date", db:"certReceivedDate"},
                {key:"Date G.I.C. Reported", type:"date", db:"reportedDate"},
                {key:"Date Rec G.I.C.", type:"date", db:"actualDate"},
                {key:"Rec On GIC", type:"date", db:"signedDate"},
                {key:"Location of GIC", type:"string", db:"location"},

                // none of these have any data
                {key:"GIC 1 First", type:"string", db:"sponsor1First"},
                {key:"GIC 1 Last", type:"string", db:"sponsor1Last"},
                {key:"GIC 1 Middle", type:"string", db:"sponsor1Middle"},
                {key:"GIC 2 First", type:"string", db:"sponsor2First"},
                {key:"GIC 2 Last", type:"string", db:"sponsor2Last"},
                {key:"GIC 2 Middle", type:"string", db:"sponsor2Middle"},
                {key:"G I C Spnsr 1 Check", type:"boolean", db:"sponsor1Checked"},
                {key:"G I C Spnsr 2 Check", type:"boolean", db:"sponsor2Checked"}
            ]
        },

        {
            check: "Degree P.R.S.",
            degreeId: 12,
            fields: [
                {key:"Cert Out P.R.S.", type:"date", db:"certSentOutToBodyDate"},
                {key:"Cert. HB P.R.S.", type:"date", db:"certSentOutForSignatureDate"},
                {key:"Cert. Rec. P.R.S.", type:"date", db:"certReceivedDate"},
                {key:"Date P.R.S. Reported", type:"date", db:"reportedDate"},
                {key:"Date Rec P.R.S.", type:"date", db:"actualDate"},
                {key:"Rec On PRS", type:"date", db:"signedDate"},
                {key:"Location of PRS", type:"string", db:"location"},

                // none of these have any data
                {key:"PRS 1 First", type:"string", db:"sponsor1First"},
                {key:"PRS 1 Last", type:"string", db:"sponsor1Last"},
                {key:"PRS 1 Middle", type:"string", db:"sponsor1Middle"},
                {key:"PRS 2 First", type:"string", db:"sponsor2First"},
                {key:"PRS 2 Last", type:"string", db:"sponsor2Last"},
                {key:"PRS 2 Middle", type:"string", db:"sponsor2Middle"},
                {key:"P R S Spnsr 1 Check", type:"boolean", db:"sponsor1Checked"},
                {key:"P R S Spnsr 2 Check", type:"boolean", db:"sponsor2Checked"}
            ]
        },

        {
            check: "Degree Seventh",
            degreeId: 13,
            fields: [
                {key:"Cert Out Seventh", type:"date", db:"certSentOutToBodyDate"},
                {key:"Cert. HB Seventh", type:"date", db:"certSentOutForSignatureDate"},
                {key:"Cert. Rec. Seventh", type:"date", db:"certReceivedDate"},
                {key:"Date Seventh Reported", type:"date", db:"reportedDate"},
                {key:"Date Rec Seventh", type:"date", db:"actualDate"},
                {key:"Rec On Seventh", type:"date", db:"signedDate"}, // no data
                {key:"Location of Seventh", type:"string", db:"location"},

                // none of these have any data
                {key:"Seventh 1 First", type:"string", db:"sponsor1First"},
                {key:"Seventh 1 Last", type:"string", db:"sponsor1Last"},
                {key:"Seventh 1 Middle", type:"string", db:"sponsor1Middle"},
                {key:"Seventh 2 First", type:"string", db:"sponsor2First"},
                {key:"Seventh 2 Last", type:"string", db:"sponsor2Last"},
                {key:"Seventh 2 Middle", type:"string", db:"sponsor2Middle"},
                {key:"Seventh Spnsr 1 Check", type:"boolean", db:"sponsor1Checked"},
                {key:"Seventh Spnsr 2 Check", type:"boolean", db:"sponsor2Checked"}
            ]
        },

        {
            check: "Degree Eigth",
            degreeId: 14,
            fields: [
                {key:"Cert Out Eighth", type:"date", db:"certSentOutToBodyDate"},
                {key:"Cert. HB Eighth", type:"date", db:"certSentOutForSignatureDate"},
                {key:"Cert. Rec. Eighth", type:"date", db:"certReceivedDate"},
                {key:"Date Eighth Reported", type:"date", db:"reportedDate"},
                {key:"Date Rec Eighth", type:"date", db:"actualDate"},
                {key:"Rec On Eighth", type:"date", db:"signedDate"}, // no data
                {key:"Location of Eighth", type:"string", db:"location"},

                // none of these have any data
                {key:"Eighth 1 First", type:"string", db:"sponsor1First"},
                {key:"Eighth 1 Last", type:"string", db:"sponsor1Last"},
                {key:"Eighth 1 Middle", type:"string", db:"sponsor1Middle"},
                {key:"Eighth 2 First", type:"string", db:"sponsor2First"},
                {key:"Eighth 2 Last", type:"string", db:"sponsor2Last"},
                {key:"Eighth 2 Middle", type:"string", db:"sponsor2Middle"},
                {key:"Eighth Spnsr 1 Check", type:"boolean", db:"sponsor1Checked"},
                {key:"Eighth Spnsr 2 Check", type:"boolean", db:"sponsor2Checked"}
            ]
        },

        {
            check: "Degree Ninth",
            degreeId: 15,
            fields: [
                //{key:"Cert Out Eighth", type:"date", db:"certSentOutToBodyDate"},
                //{key:"Cert. HB Eighth", type:"date", db:"certSentOutForSignatureDate"},
                //{key:"Cert. Rec. Eighth", type:"date", db:"certReceivedDate"},
                {key:"Date Ninth Reported", type:"date", db:"reportedDate"},
                {key:"Date Rec Ninth", type:"date", db:"actualDate"},
                {key:"Rec On Ninth", type:"date", db:"signedDate"}, // no data
                {key:"Location of Ninth", type:"string", db:"location"},

                // none of these have any data
                {key:"Ninth 1 First", type:"string", db:"sponsor1First"},
                {key:"Ninth 1 Last", type:"string", db:"sponsor1Last"},
                {key:"Ninth 1 Middle", type:"string", db:"sponsor1Middle"},
                {key:"Ninth 2 First", type:"string", db:"sponsor2First"},
                {key:"Ninth 2 Last", type:"string", db:"sponsor2Last"},
                {key:"Ninth 2 Middle", type:"string", db:"sponsor2Middle"},
                {key:"Ninth Spnsr 1 Check", type:"boolean", db:"sponsor1Checked"},
                {key:"Ninth Spnsr 2 Check", type:"boolean", db:"sponsor2Checked"}
            ]
        },

        {
            check: "Degree Tenth",
            degreeId: 16,
            fields: [
                //{key:"Cert Out Eighth", type:"date", db:"certSentOutToBodyDate"},
                //{key:"Cert. HB Eighth", type:"date", db:"certSentOutForSignatureDate"},
                //{key:"Cert. Rec. Eighth", type:"date", db:"certReceivedDate"},
                {key:"Date Tenth Reported", type:"date", db:"reportedDate"},
                {key:"Date Rec Tenth", type:"date", db:"actualDate"},
                {key:"Rec On Tenth", type:"date", db:"signedDate"},
                {key:"Location of Tenth", type:"string", db:"location"}
            ]
        },
    ]

};

exports.fields = fieldMap;

exports.createPersonFromFileMakerProRecord = input => {

    // first clean the fields, trim and get rid of undefined
    let record = {};
    for (let key in input) {
        if (typeof input[key] === 'string') {
            input[key] = input[key].trim();
            if (input[key].length > 0) record[key] = input[key];
        }
        else if (typeof input[key] !== 'undefined') {
            record[key] = input[key];
        }
    }


    let o = {
        initiations: {}
    };

    // root fields
    fieldMap.root.forEach(field => {
        parseField(record, o, field);
    });

    if (record['Tracking Number'] === 'KZT-00680') {
        //console.log('test');
    }

    // initiation sub records
    fieldMap.initiations.forEach(function(initiation) {

        // first examine the degree flag
        let hasDegree = record.hasOwnProperty(initiation.check);

        // if any of the fields for this degree has data, then disregard the flag
        if (!hasDegree) {
            initiation.fields.forEach(field => {
                if (record.hasOwnProperty(field.key) && typeof record[field.key] !== 'undefined')
                    hasDegree = true;
            });
        }

        // create an initiation record for this degree
        if (hasDegree) {
            let init = {};

            initiation.fields.forEach(field => {
                parseField(record, init, field);
            });

            o.initiations[initiation.degreeId] = init;
        }

    });

    return o;
};

function parseField(read, write, field) {
    let value = null;
    if (read.hasOwnProperty(field.key)) {
        let raw = read[field.key];
        value = parseExcelValue(field, raw);
    }

    write[field.hasOwnProperty('db') ? field.db : field.key] = value;
}

function parseExcelValue(field, value) {
    let isUndefined = (typeof value === 'undefined');

    if (field.type === "date") {
        if (isUndefined || value === 0 || typeof value !== 'number') value = null;
        else value = parseExcelSerialDate(value);
    }
    else if (field.type === 'boolean') {
        if (isUndefined || value.length === 0) value = false;
        else {
            value = value.toLowerCase();
            value = !(value === 'false' || value === 'no' || value === 'f' || value === 'n');
        }
    }
    else if (field.type === 'number') {
        if (isUndefined) value = null;
        else value = +value;
    }
    return value;
}

function parseExcelSerialDate(n) {
    let d = new Date((n - (25567 + 2))*86400*1000);

    //36516 12/22/1999
    //7     01/07/1900
    //867   05/16/1902
    //37434 06/27/2002
    let year = d.getUTCFullYear();
    if (year < 1904)
        d.setUTCFullYear(year+100);

    return d;
}