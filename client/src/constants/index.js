export const abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_vlogic",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "beacon",
        "outputs": [
            {
                "internalType": "contract LeaseBeacon",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_monthlyRent",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_incrementRate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_idLease",
                "type": "uint256"
            }
        ],
        "name": "createLease",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getBeacon",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getImplementation",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "x",
                "type": "uint256"
            }
        ],
        "name": "getVault",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "leases",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

export const contractAddress = "0x799790F3E37f6173ABe487E859DC656d0Ae1696e";

export const abiLease = [
    {
        inputs: [],
        name: "InvalidInitialization",
        type: "error",
    },
    {
        inputs: [],
        name: "NotInitializing",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "id",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "startDate",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "endDate",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "monthlyRent",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "rentDue",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "lastRentPaidDate",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "advanceAmountPaid",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "securityDepositPaid",
                        type: "uint256",
                    },
                    {
                        internalType: "bool",
                        name: "renewLease",
                        type: "bool",
                    },
                ],
                indexed: false,
                internalType: "struct LeaseContract.Tenant",
                name: "tenant",
                type: "tuple",
            },
            {
                indexed: false,
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        name: "DisputeHandled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint64",
                name: "version",
                type: "uint64",
            },
        ],
        name: "Initialized",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "id",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "startDate",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "endDate",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "monthlyRent",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "rentDue",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "lastRentPaidDate",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "advanceAmountPaid",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "securityDepositPaid",
                        type: "uint256",
                    },
                    {
                        internalType: "bool",
                        name: "renewLease",
                        type: "bool",
                    },
                ],
                indexed: false,
                internalType: "struct LeaseContract.Tenant",
                name: "tenant",
                type: "tuple",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "rent",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "newLastDate",
                type: "uint256",
            },
        ],
        name: "LeaseRenewed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "id",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "startDate",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "endDate",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "monthlyRent",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "rentDue",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "lastRentPaidDate",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "advanceAmountPaid",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "securityDepositPaid",
                        type: "uint256",
                    },
                    {
                        internalType: "bool",
                        name: "renewLease",
                        type: "bool",
                    },
                ],
                indexed: false,
                internalType: "struct LeaseContract.Tenant",
                name: "tenant",
                type: "tuple",
            },
            {
                indexed: false,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "endDate",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "securityDepositReturned",
                type: "uint256",
            },
        ],
        name: "LeaseTerminated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "string",
                name: "message",
                type: "string",
            },
        ],
        name: "Message",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "id",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "startDate",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "endDate",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "monthlyRent",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "rentDue",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "lastRentPaidDate",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "advanceAmountPaid",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "securityDepositPaid",
                        type: "uint256",
                    },
                    {
                        internalType: "bool",
                        name: "renewLease",
                        type: "bool",
                    },
                ],
                indexed: false,
                internalType: "struct LeaseContract.Tenant",
                name: "tenant",
                type: "tuple",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "rent",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "lastRentPaidDate",
                type: "uint256",
            },
        ],
        name: "RentPaid",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "enum LeaseContract.StateLeaseContract",
                name: "state",
                type: "uint8",
            },
        ],
        name: "StatusChanged",
        type: "event",
    },
    {
        inputs: [],
        name: "getCurrentTenant",
        outputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "id",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "startDate",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "endDate",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "monthlyRent",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "rentDue",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "lastRentPaidDate",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "advanceAmountPaid",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "securityDepositPaid",
                        type: "uint256",
                    },
                    {
                        internalType: "bool",
                        name: "renewLease",
                        type: "bool",
                    },
                ],
                internalType: "struct LeaseContract.Tenant",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getOwner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_id",
                type: "address",
            },
        ],
        name: "getTenant",
        outputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "id",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "startDate",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "endDate",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "monthlyRent",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "rentDue",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "lastRentPaidDate",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "advanceAmountPaid",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "securityDepositPaid",
                        type: "uint256",
                    },
                    {
                        internalType: "bool",
                        name: "renewLease",
                        type: "bool",
                    },
                ],
                internalType: "struct LeaseContract.Tenant",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_owner",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "_incrementRate",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_monthlyRent",
                type: "uint256",
            },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "payRent",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bool",
                name: "_decision",
                type: "bool",
            },
        ],
        name: "renewLeaseOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "renewLeaseTenant",
        outputs: [],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "rent",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "setAvailable",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "setInactive",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "setRented",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "terminateLease",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];