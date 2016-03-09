define(function () {
    "use strict";

    var enums = {
        moduleType: {
            customers: 'Customers',
            inspections: 'Inspections',
            supervisor: 'Supervisor',
            timesheet: 'Timesheet',
            workbench: 'Workbench',
            quoter: 'Quoter',
            administrator: 'Administrator',
            help: 'Help',
            about: 'About',
            fleetStatistics: 'FleetStatistics',
            offlineOptions: 'OfflineOptions'
        },
        authType: {
            employee: "employee",
            supervisor: "supervisor",
            none: "none"
        },
        employeelogin: {
            name: 0,
            //pin: 1,
            nameAndPin: 2
        },
        deviceType: {
            desktop: 'Desktop',
            mobile: 'Mobile',
            tablet: 'Tablet',
        },
        entryStatus: {
            none: 0,
            added: 1,
            updated: 2,
            removed: 3
        },
        keyPress: {
            enter: 13
        },
        responseStatus: {
            success: "Success",
            error: "Error"
        },
        confirmation: {
            yes: "Confirmed",
            no: "Not Confirmed"
        },
        clockType: {
            clockIn: "clockIn",
            clockOut: "clockOut"
        },
        screenStatus: {
            list: '1',
            createAndEdit: '2',
            selectItem: '3',
            refine: '4',
            detail: '5',
            upload: '6',
            wildcardSearch: '7'
        },
        entryFragment: {
            expense: 1,
            workorderOperation: 2,
            payType: 3,
            hours: 4
        },
        usageReadingMode: {
            view: 1,
            edit: 2
        },
        usageFilterMode: {
            asset: "Asset",
            fleet: "Fleet",
            uom: "Uom"
        },
        measurementFilterMode: {
            asset: "Asset",
            fleet: "Fleet",
            measurement: "Measurement"
        },
        actionType: {
            back: 1,
            refine: 2,
            nextStep: 3,
            home: 4
        },
        defectFileStatus: {
            uploaded: 2,
            choosing: 1,
            none: 0,
            uploadError: -1
        },
        defectStatusColor: ["#ADD8E6", "#FF4500", "#0000FF", "#0000FF", "#0000FF", "#32CD32"],
        notificationRatingColor: ["#FFF", "#FFFF9E", "#FFD700", "#FFA500"],
        statutoryComplianceColor: {
            isNotYetWithinFrequencyMargin: "##FFF",
            isWithinFrequencyMargin: "#FFFF9E",
            isOverdue: "#FFA500"
        },
        measurementRatingColor: ["#FFF", "#FFFF9E", "#FFD700", "#FFA500", "D9D9D9", ""],    //[0-3] rating, 4 - invalidRating , 5 - noRating
        fileUrl: {
            noImage: "noimage.jpg"
        },
        fileUploadType: {
            image: "IMAGE",
            voice: "VOICE",
            other: "OTHER"
        },
        defectFragment: {
            asset: 1,
            componentCode: 2,
            modifierCode: 3
        },
        inspectionMode: {
            simpleWizard: 1,
            simpleGrid: 2,
            advancedWizard: 3,
            advancedGrid: 4
        },
        inspectionGroupingMode: {
            noGroup: 1,
            groupByOperationalImpact: 2,
            groupByOperation: 3
        },
        ratingStyles: { noRating: null, rating1: 1, rating2: 2, rating3: 3, rating4: 4 },
        simpleInspectionResultType: {
            ok: 1,
            defect: 2
        },
        advancedInspectionResultType: {
            good: 1,
            lowAlert: 2,
            mediumAlert: 3,
            hightAlert: 4
        },
        appRunMode: {
            debug: "DEBUG",
            release: "RELEASE"
        },
        inspectionStatus: {
            outstanding: 1,
            inProgress: 2,
            completed: 3,
            deferred: 4,
            abandoned: 5,
            yetToStart: 6
        },
        customers: {
            marketAnalysisItemKey: {
                potential: { key: "forecast potential", value: "potentialcommoditycodes" },
                sales: { key: "forecast sales", value: "commoditycodes" },
                opportunity: { key: "forecast opportunity", value: "opportunitycommoditycodes" },
                actualMarketShare: { key: "actual market share", value: "sharecommoditycodes" }
            }
        },
        quoterType: {
            maintenanceAgreement: 1,
            lifeCycleEstimate: 2,
            serviceAgreement: 3
        },
        termMode: {
            insert: 1,
            edit: 2
        },
        scopeMode: {
            insert: 1,
            edit: 2
        },
        billingsMode: {
            insert: 1,
            edit: 2
        },
        costingParameterMode: {
            insert: 1,
            edit: 2
        },
        selectCustomerMode: {
            insert: 1,
            edit: 2
        },
        quoter: {
            billings: {
                key: {
                    rate: 0,
                    methodName: 1,
                    riskRating: 2,
                    discount: 3,
                    riskPremium: 4
                },
                viewMode: {
                    def: -1,
                    rate: 0,
                    billingMethod: 1,
                    discount: 2
                }
            },
            report: {
                pmStandardJob: "PM Standard Jobs"
            },
            quoteCalculationStatus: {
                repricingRequested: 1,
                repricingCalculationRequired: 2
            }
        },
        select2Action: {
            add: "add",
            remove: "remove"
        },
        filterType: {
            textBox: "TEXTBOX",
            dropDown: "DROPDOWN",
            number: "NUMBER",
            calendar: "CALENDAR"
        },
        workorderStatus: {
            outstanding: 1,
            inProgress: 2,
            completed: 3,
            deferred: 4,
            abandoned: 5,
            yts: 6
        },
        administrator: {
            labourGroup: {
                viewMode: {
                    view: 0,
                    add: 1,
                    edit: 2,
                    refine: 3
                }
            },
            labourExpenseCode: {
                viewMode: {
                    view: 0,
                    refine: 3
                }
            }
        },
        assetPerformanceType: {
            menu: 1,
            availability: 2,
            reliability: 3,
            utilisation: 4,
            costs: 5
        },
        defectFieldType: {
            asset: 0,
            componentCode: 1,
            modifierCode: 2
        },
        maxAge: {
            quote: 1000000,
            workorderAuthorization: 1000000
        },
        inspectionStepsNodes: {
            recordUsage: 0,
            viewDefects: 1,
            performInspection: 2,
            recordMeasurements: 3
        },
        documentTypes: {
            customerDocument: "customerDocuments",
            internalDocument: "internalDocuments"
        },
        documentSources: {
            report: "Report",
            library: "Library"
        },
        signs: {
            slash: "/",
            commas: ","
        },
        quoteFunctionIds: {
            contractCostSummaryInternal: 682,
            maintenanceAgreementSummary: 688,
            inclusionsExclusions: 702,
            projectionSummaryCustomer_Text: 689,
            projectionDetails: 704,
            costAnalysis: 683,
            costPerInterval: 687,
            costPerUOMByUsage: 700,
            contractHeader_Text: 706,
            serviceAgreementCostInternal: 690,
            serviceAgreementCostSummary: 691,
            lifeCycleCostSummary: 703
        },
        notificationMode: {
            insert: 1,
            edit: 2
        },
        notificationStatus: {
            open: { key: "1", value: "Open" },
            assigned: { key: "2", value: "Assigned" },
            acknowledged: { key: "3", value: "Acknowledged" },
            customerContacted: { key: "4", value: "Customer Contacted" },
            closed: { key: "5", value: "Closed" }
        },
        reportNotFound: "ReportNotFound"
    };
    return enums;
});
