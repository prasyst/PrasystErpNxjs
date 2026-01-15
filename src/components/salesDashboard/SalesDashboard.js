"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
    Box, Typography, Grid, Paper, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button,
    styled, useTheme, TextField, DialogTitle, DialogActions, Dialog, LinearProgress, Chip, TableFooter, CircularProgress,
    DialogContent, FormControlLabel, Checkbox, Badge, InputAdornment, Fade,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PercentIcon from '@mui/icons-material/Percent';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    ResponsiveContainer, ComposedChart, Area, AreaChart, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart,
    Line, CartesianGrid, Legend
} from "recharts";
import axiosInstance from "@/lib/axios";
import { toast, ToastContainer } from "react-toastify";
import { PieChart } from '@mui/x-charts/PieChart';
import OrderDocument from "./OrderDocument";
import { PDFViewer } from "@react-pdf/renderer";
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SpeedDial from '@mui/material/SpeedDial';
import GroupIcon from '@mui/icons-material/Group';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';

const CountUp = dynamic(
    async () => {
        const mod = await import("react-countup");
        return mod.default ? mod.default : mod.CountUp;
    },
    { ssr: false }
);

const StyledCard = styled(Paper)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    borderRadius: '12px',
    color: '#fff',
    gap: theme.spacing(3),
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
    '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
    },
    [theme.breakpoints.down('sm')]: {
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(1.5),
    },
}));

const StyledCard2 = styled(Paper)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    height: 300,
    borderRadius: '12px',
    backgroundColor: '#fff',
    color: '#000',
}));

const headerCellStyle = {
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#69816bff',
    padding: '2px 16px',
    position: 'sticky',
    top: 0,
    zIndex: 10,
};

// const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
//     position: 'absolute',
//     '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
//         bottom: theme.spacing(2),
//         right: theme.spacing(2),
//     },
//     '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
//         top: theme.spacing(2),
//         left: theme.spacing(2),
//     },
// }));

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
    position: 'fixed',
    top: theme.spacing(7),
    right: theme.spacing(2),
    zIndex: 1000,
}));

const actions = [
    { icon: <StorefrontIcon />, name: 'Brand' },
    { icon: <GroupIcon />, name: 'Party' },
    { icon: <AccountCircleIcon />, name: 'Broker' },
    { icon: <LocationOnIcon />, name: 'State' },
];

const SalesDashboard = () => {
    const theme = useTheme();
    const currentYear = dayjs().year();
    const previousYear = currentYear - 1;
    const [dateFrom, setDateFrom] = useState(dayjs(`${previousYear}-04-01`));
    const [dateTo, setDateTo] = useState(dayjs(`${currentYear}-03-31`));
    const [tableData, setTableData] = useState([]);
    const [partywise, setPartyWise] = useState([]);
    const [stateWise, setStateWise] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recentLoading, setRecentLoading] = useState(false);
    const [summaryData, setSummaryData] = useState({
        QTY: 0,
        BAL_QTY: 0,
        INIT_QTY: 0,
        AMOUNT: 0,
        ROWNUM: 0,
    });

    const [canOrd, setCanOrd] = useState({
        QTY: 0,
        BAL_QTY: 0,
        INIT_QTY: 0,
        AMOUNT: 0,
        ROWNUM: 0,
    });

    const [balOrd, setBalOrd] = useState({
        QTY: 0,
        BAL_QTY: 0,
        INIT_QTY: 0,
        AMOUNT: 0,
        ROWNUM: 0,
    });

    const [dispOrd, setDispOrd] = useState({
        QTY: 0,
        AMOUNT: 0,
    });

    const [shortOrd, setShortOrd] = useState({
        QTY: 0,
        BAL_QTY: 0,
        INIT_QTY: 0,
        AMOUNT: 0,
        ROWNUM: 0,
    });

    const [searchTermParty, setSearchTermParty] = useState('');
    const [searchTermState, setSearchTermState] = useState('');
    const [selectedState, setSelectedState] = useState(null);
    const [selectedParty, setSelectedParty] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fcyr, setFcyr] = useState(null);
    const [cobrId, setCobrId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentFilter, setCurrentFilter] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({
        Brand: [],
        Party: [],
        Broker: [],
        State: [],
    });
    const [searchBrand, setSearchBrand] = useState('');
    const [searchParty, setSearchParty] = useState('');
    const [searchBroker, setSearchBroker] = useState('');
    const [searchState, setSearchState] = useState('');
    const [brandDrp, setBrandDrp] = useState([]);
    const [partyDrp, setPartyDrp] = useState([]);
    const [brokerDrp, setBrokerDrp] = useState([]);
    const [stateDrp, setStateDrp] = useState([]);
    const router = useRouter();
    const [ordTrend, setOrdTrend] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [totalSales, setTotalSales] = useState(0);
    const [salesPerson, setSalesPerson] = useState([]);
    const [visible, setVisible] = useState(false);

    const handleDialogOpen = (filterName) => {
        setCurrentFilter(filterName);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleCheckboxChange = (event, actionName) => {
        const { value, checked } = event.target;
        setSelectedOptions((prevState) => {
            const updatedOptions = checked
                ? [...prevState[actionName], value]
                : prevState[actionName].filter((option) => option !== value);
            return { ...prevState, [actionName]: updatedOptions };
        });
    };

    const handleSubmit = () => {
        setOpenDialog(false);
    };

    const totalConversion = !isNaN(dispOrd.QTY) && !isNaN(summaryData.QTY) && parseFloat(summaryData.QTY) !== 0
        ? (parseFloat(dispOrd.QTY) / parseFloat(summaryData.QTY)) * 100
        : 0;

    useEffect(() => {
        setVisible(true);
    }, []);

    useEffect(() => {
        const fcyrFromStorage = localStorage.getItem("FCYR_KEY");
        const cobrIdFromStorage = localStorage.getItem("COBR_ID");
        setFcyr(fcyrFromStorage);
        setCobrId(cobrIdFromStorage);
    }, []);

    useEffect(() => {
        if (fcyr && cobrId) {
            showTableData();
            totalCoutData();
            fetchPartyWise();
            fetchCancelOrder();
            fetchOderBalance();
            fetchOderDispatch();
            fetchOderShortClose();
            stateWiseParty();
            fetchBrandDrp();
            fetchPartyDrp();
            fetchBrokerDrp();
            fetchStateDrp();
            fetchOrderTrends();
            fetchSalesPerson();
        }
    }, [fcyr, cobrId]);

    useEffect(() => {
        if (ordTrend.length > 0) {
            const grouped = ordTrend.reduce((acc, item) => {
                const monthKey = item.MONTH || "Unknown";
                const qty = Number(item.QTY) || 0;
                if (!acc[monthKey]) acc[monthKey] = 0;
                acc[monthKey] += qty;
                return acc;
            }, {});

            const formattedData = Object.entries(grouped)
                .map(([month, sales]) => ({ month, sales: Math.round(sales) }))
                .sort((a, b) => {
                    const dateA = new Date(a.month.replace(/(\w+)-(\d+)/, "$2-$1-01"));
                    const dateB = new Date(b.month.replace(/(\w+)-(\d+)/, "$2-$1-01"));
                    return dateA.getTime() - dateB.getTime();
                });

            setChartData(formattedData);

            const total = formattedData.reduce((sum, item) => sum + item.sales, 0);
            setTotalSales(total); // Now this is total QTY
        }
    }, [ordTrend]);

    // Filters payload
    const buildFilterPayload = () => ({
        Brandfilter: selectedOptions.Brand.join(','),
        Partyfilter: selectedOptions.Party.join(','),
        statefilter: selectedOptions.State.join(','),
        Brokerfilter: selectedOptions.Broker.join(','),
    });

    const showTableData = async () => {
        setRecentLoading(true);
        try {
            const filters = buildFilterPayload();
            const response = await axiosInstance.post('OrderDash/GetOrderDashBoard', {
                COBR_ID: cobrId,
                FCYR_KEY: fcyr,
                FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
                To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
                Flag: "",
                PageNumber: 1,
                PageSize: 10,
                SearchText: "",
                ...filters
            });

            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                setTableData(response.data.DATA);
            } else {
                setTableData([]);
            }
        } catch (error) {
            toast.error('Error while fetching the table data.');
        } finally {
            setRecentLoading(false);
        }
    };

    const totalCoutData = async () => {
        try {
            const filters = buildFilterPayload();
            const response = await axiosInstance.post("OrderDash/GetOrderDashBoard", {
                COBR_ID: cobrId,
                FCYR_KEY: fcyr,
                FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
                To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
                Flag: "OpenOrd",
                PageNumber: 1,
                PageSize: 10,
                SearchText: "",
                ...filters,
            });

            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                const summary = response.data.DATA[0];

                // Update the state with new fields
                setSummaryData({
                    AMOUNT: summary.AMOUNT || 0,
                    QTY: summary.QTY || 0,
                    BAL_QTY: summary.BAL_QTY || 0,
                    INIT_QTY: summary.INIT_QTY || 0,
                    ROWNUM: summary.ROWNUM || 0,
                });
            }
        } catch (error) {
            toast.error("Error from API response.");
        }
    };

    const fetchCancelOrder = async () => {
        setIsLoading(true);
        try {
            const filters = buildFilterPayload();
            const response = await axiosInstance.post("OrderDash/GetOrderDashBoard", {
                COBR_ID: cobrId,
                FCYR_KEY: fcyr,
                FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
                To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
                Flag: "CancelOrd",
                PageNumber: 1,
                PageSize: 10,
                SearchText: "",
                ...filters
            });

            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                const cancel = response.data.DATA[0];

                setCanOrd({
                    AMOUNT: cancel.AMOUNT || 0,
                    QTY: cancel.QTY || 0,
                    BAL_QTY: cancel.BAL_QTY || 0,
                    INIT_QTY: cancel.INIT_QTY || 0,
                    ROWNUM: cancel.ROWNUM || 0,
                });
            }
        } catch (error) {
            toast.error("Error from API response.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchOderBalance = async () => {
        setIsLoading(true);
        try {
            const filters = buildFilterPayload();
            const response = await axiosInstance.post("OrderDash/GetOrderDashBoard", {
                COBR_ID: cobrId,
                FCYR_KEY: fcyr,
                FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
                To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
                Flag: "BalOrd",
                PageNumber: 1,
                PageSize: 10,
                SearchText: "",
                ...filters
            });

            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                const balance = response.data.DATA[0];

                setBalOrd({
                    AMOUNT: balance.AMOUNT || 0,
                    QTY: balance.QTY || 0,
                    BAL_QTY: balance.BAL_QTY || 0,
                    INIT_QTY: balance.INIT_QTY || 0,
                    ROWNUM: balance.ROWNUM || 0,
                });
            }
        } catch (error) {
            toast.error("Error from API response.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchOderDispatch = async () => {
        setIsLoading(true);
        try {
            const filters = buildFilterPayload();
            const response = await axiosInstance.post("OrderDash/GetOrderDashBoard", {
                COBR_ID: cobrId,
                FCYR_KEY: fcyr,
                FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
                To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
                Flag: "DisOrd",
                PageNumber: 1,
                PageSize: 10,
                SearchText: "",
                ...filters
            });

            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                const disp = response.data.DATA[0];

                setDispOrd({
                    AMOUNT: disp.AMOUNT || 0,
                    QTY: disp.QTY || 0,
                    BAL_QTY: disp.BAL_QTY || 0,
                    INIT_QTY: disp.INIT_QTY || 0,
                    ROWNUM: disp.ROWNUM || 0,
                });
            }
        } catch (error) {
            toast.error("Error from API response.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchOderShortClose = async () => {
        setIsLoading(true);
        try {
            const filters = buildFilterPayload();
            const response = await axiosInstance.post("OrderDash/GetOrderDashBoard", {
                COBR_ID: cobrId,
                FCYR_KEY: fcyr,
                FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
                To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
                Flag: "ShortOrd",
                PageNumber: 1,
                PageSize: 10,
                SearchText: "",
                ...filters,
            });

            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                const disp = response.data.DATA[0];

                setShortOrd({
                    AMOUNT: disp.AMOUNT || 0,
                    QTY: disp.QTY || 0,
                    BAL_QTY: disp.BAL_QTY || 0,
                    INIT_QTY: disp.INIT_QTY || 0,
                    ROWNUM: disp.ROWNUM || 0,
                });
            }
        } catch (error) {
            toast.error("Error from API response.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPartyWise = async () => {
        setIsLoading(true);
        try {
            const filters = buildFilterPayload();
            const response = await axiosInstance.post("OrderDash/GetOrderDashBoard", {
                COBR_ID: cobrId,
                FCYR_KEY: fcyr,
                FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
                To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
                Flag: "PartyWise",
                PageNumber: 1,
                PageSize: 10,
                SearchText: "",
                ...filters
            });
            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                setPartyWise(response.data.DATA);
            } else {
                setPartyWise([]);
            }
        } catch (error) {
            toast.error("Error while loading party data.");
        } finally {
            setIsLoading(false);
        }
    };

    const stateWiseParty = async () => {
        try {
            const filters = buildFilterPayload();
            const response = await axiosInstance.post("OrderDash/GetOrderDashBoard", {
                COBR_ID: cobrId,
                FCYR_KEY: fcyr,
                FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
                To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
                Flag: "StateWiseOrdSum",
                PageNumber: 1,
                PageSize: 10,
                SearchText: "",
                ...filters
            });
            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                setStateWise(response.data.DATA);
            } else {
                setStateWise([]);
            }
        } catch (error) {
            toast.error("Error while fetching the state.");
        }
    };

    const fetchBrandDrp = async () => {
        try {
            const response = await axiosInstance.post('Brand/GetBrandDrp', {})
            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                setBrandDrp(response.data.DATA);
            };
        } catch (error) {
            toast.error("Error while fetching the brand.");
        }
    };

    const fetchPartyDrp = async () => {
        try {
            const response = await axiosInstance.post("Party/GetParty_By_Name", {
                PARTY_NAME: ""
            });
            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                setPartyDrp(response.data.DATA);
            };
        } catch (error) {
            toast.error("Error while fetching party.");
        }
    };

    const fetchBrokerDrp = async () => {
        try {
            const response = await axiosInstance.post('BROKER/GetBrokerDrp', {
                PARTY_KEY: "",
                FLAG: "Drp",
                BROKER_KEY: "",
                PageNumber: 1,
                PageSize: 10,
                SearchText: ""
            });
            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                setBrokerDrp(response.data.DATA);
            };
        } catch (error) {
            toast.error("Error while fetching the broker.");
        }
    };

    const fetchStateDrp = async () => {
        try {
            const response = await axiosInstance.post("PinCode/GetPinCodeDrp", {
                FLAG: "State",
                STATE_KEY: ""
            });
            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                setStateDrp(response.data.DATA);
            };
        } catch (error) {
            toast.error("Error while fetching the State.");
        }
    };

    const fetchOrderTrends = async () => {
        try {
            const filters = buildFilterPayload();
            const response = await axiosInstance.post("OrderDash/GetOrderDashBoard", {
                COBR_ID: cobrId,
                FCYR_KEY: fcyr,
                FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
                To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
                Flag: "MonthWise",
                PageNumber: 1,
                PageSize: 10,
                SearchText: "",
                ...filters
            });
            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                setOrdTrend(response.data.DATA);
            };
        } catch (error) {
            toast.error("Error while fetching monthly trends.");
        }
    };

    const fetchSalesPerson = async () => {
        try {
            const filters = buildFilterPayload();
            const response = await axiosInstance.post("OrderDash/GetOrderDashBoard", {
                COBR_ID: cobrId,
                FCYR_KEY: fcyr,
                FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
                To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
                Flag: "SalepersonWise",
                PageNumber: 1,
                PageSize: 10,
                SearchText: "",
                ...filters
            });

            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                const transformedData = response.data.DATA.map((item) => ({
                    month: item.SALEPERSON_NAME,
                    amt: item.AMT / 100000,
                    qty: item.QTY / 100000
                }));
                setSalesPerson(transformedData);
            }
        } catch (error) {
            toast.error("Error while fetching sales person.");
        }
    };

    const handleFetchedData = () => {
        showTableData();
        totalCoutData();
        fetchPartyWise();
        fetchCancelOrder();
        fetchOderBalance();
        fetchOderDispatch();
        fetchOderShortClose();
        stateWiseParty();
        fetchOrderTrends();
        fetchSalesPerson();
    };

    const handleViewDocument = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Handle search input change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // You would filter your data based on the search term
    const filteredData = tableData.filter((item) => {
        return (
            (item.ORDBK_NO?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
            (item.PARTY_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
            (item.CITY_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
            (item.STATE_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
            (item.FGCAT_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
            (item.FGPRD_ABRV?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
            (item.BRAND_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
            (item.BROKER_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
            (item.SALEPERSON_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
        );
    });

    // Filtered Party Wise
    const filteredPartyWise = useMemo(() => {
        if (!searchTermParty.trim()) return partywise;

        const term = searchTermParty.toLowerCase().trim();
        return partywise.filter((item) =>
            Object.values(item).some((value) =>
                value?.toString().toLowerCase().includes(term)
            )
        );
    }, [partywise, searchTermParty]);

    // Filtered State Wise
    const filteredStateWise = useMemo(() => {
        if (!searchTermState.trim()) return stateWise;

        const term = searchTermState.toLocaleLowerCase().trim();
        return stateWise.filter((item) =>
            Object.values(item).some((value) =>
                value?.toString().toLowerCase().includes(term)
            )
        );
    }, [stateWise, searchTermState]);

    const handleRowDoubleClick = () => {
        router.push(`/inverntory/stock-enquiry-table/`);
    };

    // Top 10 Parties
    const top10PartiesByAmount = [...partywise]
        .sort((a, b) => parseFloat(b.AMOUNT || 0) - parseFloat(a.AMOUNT || 0))
        .slice(0, 10)
        .map((item, index) => ({
            id: index,
            label: item.PARTY_NAME?.slice(0, 15) + (item.PARTY_NAME?.length > 15 ? '...' : ''),
            value: parseFloat(item.AMOUNT || 0),
            color: `hsl(${index * 40}, 70%, 50%)`,
            fullPartyName: item.PARTY_NAME || "Unknown",
        }));

    return (
        <Box sx={{ p: 2, pt: 1, bgcolor: "#f5f7fa", minHeight: "70vh" }}>
            <ToastContainer />
            <Box
                sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    flexDirection: { xs: "column", sm: "row" },
                    flexWrap: "wrap",
                    gap: { xs: 2, sm: 1 },
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{
                        background: "linear-gradient(45deg, #42a5f5, #478ed1, #7b1fa2)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        userSelect: "none",
                    }}
                >
                    Order Dashboard
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                        <DatePicker
                            label="From-Date"
                            value={dateFrom}
                            onChange={(newValue) => setDateFrom(newValue)}
                            format="DD/MM/YYYY"
                            views={['day', 'month', 'year']}
                            sx={{
                                width: 150,
                                '& .MuiPickersSectionList-root': {
                                    padding: '7.5px 0',
                                },
                            }}
                        />
                        <DatePicker
                            label="To-Date"
                            value={dateTo}
                            onChange={(newValue) => setDateTo(newValue)}
                            format="DD/MM/YYYY"
                            views={['day', 'month', 'year']}
                            sx={{
                                width: 150,
                                '& .MuiPickersSectionList-root': {
                                    padding: '7.5px 0',
                                },
                            }}
                            className="custom-datepicker"
                        />
                        <Button size="small"
                            variant="contained"
                            onClick={handleFetchedData}
                            sx={{
                                borderRadius: '20px',
                                backgroundColor: '#635bff',
                                '&:hover': {
                                    backgroundColor: '#635bff'
                                },
                            }}
                        >
                            Get Data
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            onClick={() => setOpenDialog(true)}
                            startIcon={< FilterListIcon />}
                            sx={{
                                borderRadius: '20px',
                                backgroundColor: '#635bff',
                                '&:hover': {
                                    backgroundColor: '#635bff'
                                },
                            }}
                        >
                            Filters
                        </Button>
                        {/* <StyledSpeedDial ariaLabel="Filters" direction="down" icon={<SpeedDialIcon />}>
                            {actions.map((action) => {
                                const count = selectedOptions[action.name]?.length || 0;
                                return (
                                    <SpeedDialAction
                                        key={action.name}
                                        icon={
                                            <Badge badgeContent={count} color="primary" invisible={count === 0}>
                                                {action.icon}
                                            </Badge>
                                        }
                                        tooltipTitle={`${action.name} (${count} selected)`}
                                        onClick={() => setOpenDialog(true)}
                                    />
                                );
                            })}
                        </StyledSpeedDial> */}

                        {/* Dialog to show checkboxes */}
                        <Dialog
                            open={openDialog}
                            onClose={handleDialogClose}
                            // maxWidth='md'
                            fullWidth
                            PaperProps={{
                                sx: {
                                    borderRadius: 4,
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                                    overflow: 'hidden',
                                    maxWidth: 'none',
                                    width: 1000,
                                    height: 500,
                                }
                            }}
                        >
                            <DialogTitle
                                sx={{
                                    background: 'linear-gradient(135deg, #635bff 0%, #8a7fff 100%)',
                                    color: 'white',
                                    py: 1,
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '1.6rem',
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography variant="h5">Selected Filters</Typography>

                                    {Object.values(selectedOptions).flat().length > 0 && (
                                        <Chip
                                            label={`${Object.values(selectedOptions).flat().length} selected`}
                                            size="medium"
                                            sx={{
                                                backgroundColor: 'rgba(255, 0, 119, 0.7)',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                backdropFilter: 'blur(6px)',
                                            }}
                                        />
                                    )}
                                </Box>
                            </DialogTitle>

                            <DialogContent sx={{ p: 4, backgroundColor: '#fafbff' }}>
                                <Grid container spacing={1}>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-start',
                                            alignItems: 'center',
                                            mb: 1,
                                            position: 'sticky',
                                            top: 0,
                                            py: 1,
                                            zIndex: 10,
                                            bgcolor: '#fafbff',
                                            borderBottom: '1px solid #e0e0e0',
                                        }}>
                                            <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mr: 1 }}>
                                                Party
                                            </Typography>
                                            <Chip label={selectedOptions.Party.length} size="small" color="primary" sx={{ mt: 0.5 }} />
                                        </Box>

                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="Parties..."
                                            value={searchParty}
                                            onChange={(e) => setSearchParty(e.target.value)}
                                            InputProps={{
                                                startAdornment: <SearchIcon fontSize="small" sx={{ color: 'action.active', mr: 1 }} />,
                                                endAdornment: searchParty && (
                                                    <IconButton size="small" onClick={() => setSearchParty('')}>
                                                        <ClearIcon fontSize="small" />
                                                    </IconButton>
                                                ),
                                            }}
                                            sx={{
                                                mb: 3,
                                                borderRadius: '50px',
                                                maxWidth: 200,
                                                height: 20,
                                                '& .MuiInputBase-input': {
                                                    padding: '4.5px 0px',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderRadius: '50px',
                                                },
                                            }}
                                        />

                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            {partyDrp
                                                .filter(option => option.PARTY_NAME.toLowerCase().includes(searchParty.toLowerCase()))
                                                .sort((a, b) => {
                                                    const aChecked = selectedOptions.Party.includes(a.PARTY_KEY);
                                                    const bChecked = selectedOptions.Party.includes(b.PARTY_KEY);

                                                    if (aChecked && !bChecked) return -1;
                                                    if (!aChecked && bChecked) return 1;
                                                    return 0;
                                                })
                                                .map((option) => (
                                                    <FormControlLabel
                                                        key={option.PARTY_KEY}
                                                        control={
                                                            <Checkbox
                                                                checked={selectedOptions.Party.includes(option.PARTY_KEY)}
                                                                onChange={(e) => handleCheckboxChange(e, 'Party')}
                                                                value={option.PARTY_KEY}
                                                                size="small"
                                                                sx={{ color: '#635bff', '&.Mui-checked': { color: '#635bff' }, p: 0.3 }}
                                                            />
                                                        }
                                                        label={<Typography variant="body2">{option.PARTY_NAME}</Typography>}
                                                        sx={{
                                                            mx: 0,
                                                            my: 0.2,
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(99, 91, 255, 0.12)',
                                                                borderRadius: 1
                                                            }
                                                        }}
                                                    />
                                                ))}
                                        </Box>
                                    </Grid>

                                    {/* Broker */}
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-start',
                                            alignItems: 'center',
                                            mb: 1,
                                            position: 'sticky',
                                            top: 0,
                                            py: 1,
                                            zIndex: 10,
                                            bgcolor: '#fafbff',
                                            borderBottom: '1px solid #e0e0e0',
                                        }}>
                                            <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mr: 1 }}>
                                                Broker
                                            </Typography>
                                            <Chip label={selectedOptions.Broker.length} size="small" color="primary" sx={{ mt: 0.5 }} />
                                        </Box>

                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="Brokers..."
                                            value={searchBroker}
                                            onChange={(e) => setSearchBroker(e.target.value)}
                                            InputProps={{
                                                startAdornment: <SearchIcon fontSize="small" sx={{ color: 'action.active', mr: 1 }} />,
                                                endAdornment: searchBroker && (
                                                    <IconButton size="small" onClick={() => setSearchBroker('')}>
                                                        <ClearIcon fontSize="small" />
                                                    </IconButton>
                                                ),
                                            }}
                                            sx={{
                                                mb: 3,
                                                borderRadius: '50px',
                                                maxWidth: 150,
                                                height: 20,
                                                '& .MuiInputBase-input': {
                                                    padding: '4.5px 0px',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderRadius: '50px',
                                                },
                                            }}
                                        />

                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            {brokerDrp
                                                .filter(option => option.BROKER_NAME.toLowerCase().includes(searchBroker.toLowerCase()))
                                                .sort((a, b) => {
                                                    const aChecked = selectedOptions.Broker.includes(a.BROKER_KEY);
                                                    const bChecked = selectedOptions.Broker.includes(b.BROKER_KEY);

                                                    if (aChecked && !bChecked) return -1;
                                                    if (!aChecked && bChecked) return 1;
                                                    return 0
                                                })
                                                .map((option) => (
                                                    <FormControlLabel
                                                        key={option.BROKER_KEY}
                                                        control={
                                                            <Checkbox
                                                                checked={selectedOptions.Broker.includes(option.BROKER_KEY)}
                                                                onChange={(e) => handleCheckboxChange(e, 'Broker')}
                                                                value={option.BROKER_KEY}
                                                                size="small"
                                                                sx={{ color: '#635bff', '&.Mui-checked': { color: '#635bff' }, p: 0.3 }}
                                                            />
                                                        }
                                                        label={<Typography variant="body2">{option.BROKER_NAME}</Typography>}
                                                        sx={{
                                                            mx: 0,
                                                            my: 0.2,
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(99, 91, 255, 0.12)',
                                                                borderRadius: 1
                                                            }
                                                        }}
                                                    />
                                                ))}
                                        </Box>
                                    </Grid>

                                    {/* State */}
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-start',
                                            alignItems: 'center',
                                            mb: 1,
                                            position: 'sticky',
                                            top: 0,
                                            py: 1,
                                            zIndex: 10,
                                            bgcolor: '#fafbff',
                                            borderBottom: '1px solid #e0e0e0',
                                        }}>
                                            <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mr: 1 }}>
                                                State
                                            </Typography>

                                            <Chip
                                                label={`${selectedOptions.State.length}`}
                                                size="small"
                                                color="primary"
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        </Box>

                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="States..."
                                            value={searchState}
                                            onChange={(e) => setSearchState(e.target.value)}
                                            InputProps={{
                                                startAdornment: <SearchIcon fontSize="small" sx={{ color: 'action.active', mr: 1 }} />,
                                                endAdornment: searchState && (
                                                    <IconButton size="small" onClick={() => setSearchState('')}>
                                                        <ClearIcon fontSize="small" />
                                                    </IconButton>
                                                ),
                                            }}
                                            sx={{
                                                mb: 3,
                                                borderRadius: '50px',
                                                maxWidth: 150,
                                                height: 20,
                                                '& .MuiInputBase-input': {
                                                    padding: '4.5px 0px',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderRadius: '50px',
                                                },
                                            }}
                                        />

                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            {stateDrp
                                                .filter(option => option.STATE_NAME.toLowerCase().includes(searchState.toLowerCase()))
                                                .sort((a, b) => {
                                                    const aChecked = selectedOptions.State.includes(a.STATE_KEY);
                                                    const bChecked = selectedOptions.State.includes(b.STATE_KEY);

                                                    if (aChecked && !bChecked) return -1;
                                                    if (!aChecked && bChecked) return 1;
                                                    return 0;
                                                })
                                                .map((option) => (
                                                    <FormControlLabel
                                                        key={option.STATE_KEY}
                                                        control={
                                                            <Checkbox
                                                                checked={selectedOptions.State.includes(option.STATE_KEY)}
                                                                onChange={(e) => handleCheckboxChange(e, 'State')}
                                                                value={option.STATE_KEY}
                                                                size="small"
                                                                sx={{ color: '#635bff', '&.Mui-checked': { color: '#635bff' }, p: 0.3 }}
                                                            />
                                                        }
                                                        label={<Typography variant="body2">{option.STATE_NAME}</Typography>}
                                                        sx={{
                                                            mx: 0,
                                                            my: 0.2,
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(99, 91, 255, 0.12)',
                                                                borderRadius: 1
                                                            }
                                                        }}
                                                    />
                                                ))}
                                        </Box>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                alignItems: 'center',
                                                mb: 1,
                                                position: 'sticky',
                                                top: 0,
                                                backgroundColor: '#fafbff',
                                                zIndex: 10,
                                                py: 1,
                                                borderBottom: '1px solid #e0e0e0',
                                            }}
                                        >
                                            <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mr: 1 }}>
                                                Brand
                                            </Typography>
                                            <Chip
                                                label={selectedOptions.Brand.length}
                                                size="small"
                                                color="primary"
                                                sx={{ mt: 0.5 }}
                                            />
                                        </Box>

                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="Brands..."
                                            value={searchBrand}
                                            onChange={(e) => setSearchBrand(e.target.value)}
                                            InputProps={{
                                                startAdornment: <SearchIcon fontSize="small" sx={{ color: 'action.active', mr: 1 }} />,
                                                endAdornment: searchBrand && (
                                                    <IconButton size="small" onClick={() => setSearchBrand('')}>
                                                        <ClearIcon fontSize="small" />
                                                    </IconButton>
                                                ),
                                            }}
                                            sx={{
                                                mb: 3,
                                                borderRadius: '50px',
                                                maxWidth: 150,
                                                height: 20,
                                                '& .MuiInputBase-input': {
                                                    padding: '4.5px 0px',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderRadius: '50px',
                                                },
                                            }}
                                        />

                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            {brandDrp
                                                .filter(option => option.BRAND_NAME.toLowerCase().includes(searchBrand.toLowerCase()))
                                                .sort((a, b) => {
                                                    const aChecked = selectedOptions.Brand.includes(a.BRAND_KEY);
                                                    const bChecked = selectedOptions.Brand.includes(b.BRAND_KEY);

                                                    if (aChecked && !bChecked) return -1;
                                                    if (!aChecked && bChecked) return 1;
                                                    return 0;
                                                })
                                                .map((option) => (
                                                    <FormControlLabel
                                                        key={option.BRAND_KEY}
                                                        control={
                                                            <Checkbox
                                                                checked={selectedOptions.Brand.includes(option.BRAND_KEY)}
                                                                onChange={(e) => handleCheckboxChange(e, 'Brand')}
                                                                value={option.BRAND_KEY}
                                                                size="small"
                                                                sx={{
                                                                    color: '#635bff',
                                                                    '&.Mui-checked': { color: '#635bff' },
                                                                    p: 0.3,
                                                                }}
                                                            />
                                                        }
                                                        label={<Typography variant="body2">{option.BRAND_NAME}</Typography>}
                                                        sx={{
                                                            mx: 0,
                                                            my: 0.2,
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(99, 91, 255, 0.12)',
                                                                borderRadius: 1,
                                                            },
                                                        }}
                                                    />
                                                ))}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </DialogContent>

                            {/* Footer */}
                            <DialogActions sx={{
                                p: 1,
                                backgroundColor: '#f0f2ff',
                                justifyContent: 'space-between',
                                borderTop: '1px solid #ddd'
                            }}>
                                <Button size="small"
                                    onClick={() => {
                                        setSelectedOptions({ Brand: [], Party: [], Broker: [], State: [] });
                                        setSearchBrand('');
                                        setSearchParty('');
                                        setSearchBroker('');
                                        setSearchState('');
                                    }}
                                    startIcon={<ClearIcon />}
                                    color="error"
                                >
                                    Clear All
                                </Button>

                                <Box>
                                    <Button color="error" size="small" onClick={handleDialogClose} sx={{ mr: 2 }}>
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => {
                                            handleDialogClose();
                                            handleFetchedData();
                                            toast.success("Filters applied.");
                                        }}
                                        sx={{
                                            backgroundColor: '#635bff',
                                            '&:hover': { backgroundColor: '#5548d9' },
                                            boxShadow: '0 6px 20px rgba(99,91,255,0.3)'
                                        }}
                                    >
                                        Apply Filters
                                    </Button>
                                </Box>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </LocalizationProvider>
            </Box>

            {/* Cards Data */}
            <Grid container spacing={1} mb={2} gap={1}>
                <Grid size={{ xs: 12, md: 3 }} sx={{ display: "flex" }}>
                    <Fade in={visible} timeout={500}>
                        <StyledCard sx={{ width: "100%", position: "relative", bgcolor: '#64B5F6' }}>
                            <IconButton
                                sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    bgcolor: "transparent",
                                    color: "#003366",
                                    width: 60,
                                    height: 60,
                                }}
                                aria-label="Total Orders"
                            >
                                <ReceiptLongIcon fontSize="large" />
                            </IconButton>
                            <Box>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                    Total Orders - {summaryData.ROWNUM}
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                    Value: ₹ {(summaryData.AMOUNT / 100000).toFixed(2)} L
                                </Typography>
                                <Typography variant="h6" fontWeight="bold" sx={{ mt: 0.5 }}>
                                    Qty: {summaryData.QTY}
                                </Typography>
                            </Box>
                        </StyledCard>
                    </Fade>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }} sx={{ display: "flex" }}>
                    <Fade in={visible} timeout={1000}>
                        <StyledCard sx={{ width: "100%", position: 'relative', bgcolor: '#7BBE9F' }}>
                            <IconButton
                                sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    bgcolor: "transparent",
                                    color: "#1B5E20",
                                    width: 60,
                                    height: 60,
                                }}
                                aria-label="Dispatch"
                            >
                                <ShoppingCartIcon fontSize="large" />
                            </IconButton>
                            <Box>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                    Dispatch
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                    Value: ₹{(dispOrd.AMOUNT / 100000).toFixed(2)} L
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                    Qty: {dispOrd.QTY}
                                </Typography>
                            </Box>
                        </StyledCard>
                    </Fade>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }} sx={{ display: "flex" }}>
                    <Fade in={visible} timeout={1500}>
                        <StyledCard sx={{ width: "100%", position: 'relative', bgcolor: '#B197E6' }}>
                            <IconButton
                                sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    bgcolor: "transparent",
                                    color: "#4A148C",
                                    width: 60,
                                    height: 60,
                                }}
                                aria-label="Conversion %"
                            >
                                <PercentIcon fontSize="large" />
                            </IconButton>
                            <Box>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                    Conversion Ratio
                                </Typography>
                                <Typography variant="h6" fontWeight="bold" letterSpacing={1}>
                                    {totalConversion.toFixed(2)}%
                                </Typography>
                                <Box display="flex" alignItems="center" gap={0.5}>
                                    {totalConversion > 50 ? (
                                        <ArrowUpwardIcon sx={{ color: '#388E3C' }} fontSize="small" />
                                    ) : (
                                        <ArrowDownwardIcon sx={{ color: '#D32F2F' }} fontSize="small" />
                                    )}
                                    <Typography variant="body2" color={totalConversion > 50 ? "success.main" : "error.main"} fontWeight={600}>
                                        {totalConversion.toFixed(0) ?? '0.00'}%
                                    </Typography>
                                </Box>
                                <Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={totalConversion}
                                        sx={{ height: 10, borderRadius: 5, bgcolor: '#E1BEE7' }}
                                        color="success"
                                    />
                                </Box>
                            </Box>
                        </StyledCard>
                    </Fade>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }} sx={{ display: "flex" }}>
                    <Fade in={visible} timeout={2000}>
                        <StyledCard sx={{ width: "100%", position: 'relative', bgcolor: '#FF8C71' }}>
                            <IconButton
                                sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    bgcolor: "transparent",
                                    color: "#6e3904",
                                    width: 60,
                                    height: 60,
                                }}
                                aria-label="Order Balance"
                            >
                                <AccessAlarmIcon fontSize="large" />
                            </IconButton>
                            <Box>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                    Pending Order
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                    Value: ₹ {(balOrd.AMOUNT / 100000).toFixed(2)} L
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                    Qty: {balOrd.QTY} |  Cancel Qty: {canOrd.QTY}
                                </Typography>
                            </Box>
                        </StyledCard>
                    </Fade>
                </Grid>
            </Grid>

            <Grid container spacing={2} mt={2}>
                <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <StyledCard2 sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" align="center" gutterBottom>
                            Top 10 Parties
                        </Typography>
                        <PieChart
                            series={[
                                {
                                    data: top10PartiesByAmount,
                                    innerRadius: 30,
                                    outerRadius: 90,
                                    paddingAngle: 3,
                                    cornerRadius: 8,
                                    highlightScope: { faded: 'global', highlighted: 'item' },
                                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                },
                            ]}
                            height={200}
                            slotProps={{
                                legend: {
                                    direction: 'column',
                                    position: { vertical: 'middle', horizontal: 'start' },
                                    padding: { left: 10 },
                                    style: { color: 'black' },
                                },
                            }}
                            onItemClick={(event, { dataIndex }) => {
                                const clicked = top10PartiesByAmount[dataIndex];
                                setSelectedParty(clicked?.fullPartyName || null);
                            }}
                        >
                        </PieChart>
                    </StyledCard2>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <StyledCard2 sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" align="center" gutterBottom>
                            Top 10 States
                        </Typography>
                        {stateWise.length > 0 ? (
                            <PieChart
                                series={[
                                    {
                                        data: stateWise
                                            .sort((a, b) => parseFloat(b.AMOUNT || 0) - parseFloat(a.AMOUNT || 0))
                                            .slice(0, 10)
                                            .map((item, index) => {
                                                const totalAmount = stateWise.reduce((sum, state) => sum + parseFloat(state.AMOUNT || 0), 0);
                                                const percentage = ((parseFloat(item.AMOUNT || 0) / totalAmount) * 100).toFixed(2);
                                                return {
                                                    id: index,
                                                    label: `${(item.STATE_NAME || "Unknown").slice(0, 18)}${item.STATE_NAME?.length > 18 ? '...' : ''} - ${percentage}%`,
                                                    value: parseFloat(item.AMOUNT || 0),
                                                    color: `hsl(${index * 36}, 70%, 50%)`,
                                                    fullStateName: item.STATE_NAME || "Unknown",
                                                };
                                            }),
                                        innerRadius: 20,
                                        outerRadius: 90,
                                        paddingAngle: 2,
                                        cornerRadius: 2,
                                        highlightScope: { faded: 'global', highlighted: 'item' },
                                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                    },
                                ]}
                                height={230}
                                slotProps={{
                                    legend: {
                                        direction: 'column',
                                        position: { vertical: 'middle', horizontal: 'right' },
                                        padding: { left: 10 },
                                        style: { color: 'black' },
                                    },
                                }}
                                onItemClick={(event, { dataIndex }) => {
                                    const clickedItem = stateWise
                                        .sort((a, b) => parseFloat(b.AMOUNT || 0) - parseFloat(a.AMOUNT || 0))
                                        .slice(0, 10)[dataIndex];

                                    const stateName = clickedItem?.STATE_NAME || null;
                                    setSelectedState(stateName);
                                }}
                            >
                            </PieChart>
                        ) : (
                            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                <Typography color="text.secondary">No state data available</Typography>
                            </Box>
                        )}
                    </StyledCard2>
                </Grid>
            </Grid>

            {/* Recent Orders Table */}
            <Grid container spacing={2} sx={{ height: '100%', mt: 2 }}>
                <Grid size={{ xs: 12, md: 12, lg: 12 }} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Paper
                        elevation={5}
                        sx={{
                            p: 2,
                            borderRadius: 4,
                            bgcolor: 'white',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            overflow: 'hidden',
                            position: 'relative',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography
                                variant="h5"
                                fontWeight="700"
                                sx={{
                                    backgroundImage: 'linear-gradient(to right, #5f1504, #7e4308, #524605, #024604, #022b55)',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                    letterSpacing: '0.5px',
                                }}
                            >
                                Recent Orders
                            </Typography>

                            <TextField
                                label="Search Orders"
                                variant="outlined"
                                size="small"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Order No, Party, etc."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    width: 250,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        bgcolor: '#f8fafc',
                                        fontSize: '0.875rem',
                                        padding: '0px 14px'
                                    },
                                    '& .MuiInputBase-input': {
                                        padding: '6.5px 0px',
                                    },
                                }}
                            />
                        </Box>

                        {/* Table Container */}
                        <TableContainer sx={{ flexGrow: 1, maxHeight: 250, overflow: 'auto', position: 'relative' }}>
                            <Table stickyHeader size="small" sx={{ minWidth: 1100 }}>
                                <TableHead>
                                    <TableRow>
                                        {['View', 'OrderNo', 'Date', 'Party', 'City', 'State', 'Qty', 'Broker', 'Salesman', 'Status'].map((header) => (
                                            <TableCell
                                                key={header}
                                                sx={{
                                                    bgcolor: '#f1f5f9',
                                                    color: '#334155',
                                                    fontWeight: 700,
                                                    fontSize: '0.8125rem',
                                                    letterSpacing: '0.8px',
                                                    borderBottom: '2px solid #cbd5e1',
                                                    borderRight: '1px solid #e2e8f0',
                                                    '&:last-child': { borderRight: 'none' },
                                                    py: 0.5,
                                                    px: 1,
                                                    padding: '0px 16px',
                                                }}
                                            >
                                                {header}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredData.length > 0 ? (
                                        filteredData.map((item, index) => (
                                            <TableRow
                                                key={item.ORDBK_NO}
                                                hover
                                                onDoubleClick={() => handleRowDoubleClick(item)}
                                                sx={{
                                                    bgcolor: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                                                    cursor: 'pointer',
                                                    transition: 'background-color 0.18s ease',
                                                    '&:hover': {
                                                        bgcolor: '#e0f2fe !important',
                                                    },
                                                }}
                                            >
                                                <TableCell sx={{ borderRight: '1px solid #e2e8f0', padding: '0px 16px' }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleViewDocument(item)}
                                                        sx={{ color: '#635bff', p: 0.5 }}
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell sx={{ borderRight: '1px solid #e2e8f0', fontSize: '0.875rem', padding: '0px 16px' }}>
                                                    {item.ORDBK_NO}
                                                </TableCell>
                                                <TableCell sx={{ borderRight: '1px solid #e2e8f0', fontSize: '0.875rem', padding: '0px 16px' }}>
                                                    {dayjs(item.ORDBK_DT).format('DD/MM/YYYY')}
                                                </TableCell>
                                                <TableCell sx={{ borderRight: '1px solid #e2e8f0', fontSize: '0.875rem', padding: '0px 16px' }}>
                                                    {item.PARTY_NAME}
                                                </TableCell>
                                                <TableCell sx={{ borderRight: '1px solid #e2e8f0', fontSize: '0.875rem', padding: '0px 16px' }}>
                                                    {item.CITY_NAME}
                                                </TableCell>
                                                <TableCell sx={{ borderRight: '1px solid #e2e8f0', fontSize: '0.875rem', padding: '0px 16px' }}>
                                                    {item.STATE_NAME}
                                                </TableCell>
                                                <TableCell sx={{ borderRight: '1px solid #e2e8f0', fontWeight: 700, fontSize: '0.875rem', padding: '0px 16px' }}>
                                                    {item.QTY}
                                                </TableCell>
                                                <TableCell sx={{ borderRight: '1px solid #e2e8f0', fontSize: '0.875rem', padding: '0px 16px' }}>
                                                    {item.BROKER_NAME}
                                                </TableCell>
                                                <TableCell sx={{ borderRight: '1px solid #e2e8f0', fontSize: '0.875rem', padding: '0px 16px' }}>
                                                    {item.SALEPERSON_NAME}
                                                </TableCell>
                                                <TableCell sx={{ padding: '0px 16px' }}>
                                                    <Chip
                                                        label={item.STATUS === 'CANL' ? 'Cancelled' : item.STATUS || 'Active'}
                                                        size="small"
                                                        color={item.STATUS === 'CANL' ? 'error' : 'success'}
                                                        sx={{
                                                            fontSize: '0.75rem',
                                                            height: 20,
                                                            fontWeight: 600,
                                                            minWidth: 76,
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={10} align="center" sx={{ py: 12 }}>
                                                <Typography variant="body2" color="#64748b" fontStyle="italic">
                                                    No records found.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            {recentLoading && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        bgcolor: 'rgba(255, 255, 255, 0.85)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 10,
                                        borderRadius: 4,
                                    }}
                                >
                                    <CircularProgress size="3rem" thickness={4.5} color="primary" />
                                    <Typography variant="body1" sx={{ mt: 2, color: '#334155', fontWeight: 500 }}>
                                        Loading recent orders...
                                    </Typography>
                                </Box>
                            )}
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>

            {/* Party Wise Orders Summary */}
            <Grid container spacing={2} sx={{ height: '100%', mt: 2 }}>
                <Grid size={{ xs: 12, md: 12 }} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Paper
                        elevation={5}
                        sx={{
                            p: 1.5,
                            borderRadius: 4,
                            bgcolor: 'white',
                            boxShadow: '0 10px 30px rgb(0 0 0 / 0.12)',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" fontWeight="bold"
                                sx={{
                                    background: 'linear-gradient(45deg, #dd2818, #670aa1)',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                    fontSize: '1.25rem',
                                    letterSpacing: 0.5,
                                }}
                            >
                                Party Wise Orders Summary
                            </Typography>

                            <TextField
                                variant="outlined"
                                size="small"
                                sx={{
                                    width: 250,
                                    borderRadius: '9px',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '20px',
                                        padding: '4px 10px',
                                        height: '32px',
                                    },
                                    '& .MuiInputLabel-root': {
                                        borderRadius: '9px',
                                        fontSize: '0.875rem',
                                        top: '-6px',
                                    },
                                }}
                                value={searchTermParty}
                                onChange={(e) => setSearchTermParty(e.target.value)}
                                placeholder="Search by Party, City, Amount, etc."
                                InputProps={{
                                    style: {
                                        padding: '0px 10px',
                                    },
                                }}
                            />
                        </Box>

                        {/* Table Container with fixed height */}
                        <TableContainer sx={{ flexGrow: 1, maxHeight: 250, overflowY: 'auto', overflowX: 'auto' }}>
                            <Table stickyHeader size="small" aria-label="recent orders">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={headerCellStyle}>Party</TableCell>
                                        <TableCell sx={headerCellStyle}>City</TableCell>
                                        <TableCell sx={headerCellStyle}>State</TableCell>
                                        <TableCell sx={headerCellStyle}>Amount</TableCell>
                                        <TableCell sx={headerCellStyle}>Qty</TableCell>
                                        <TableCell sx={headerCellStyle}>Broker</TableCell>
                                        <TableCell sx={headerCellStyle}> SalesMan</TableCell>
                                    </TableRow>
                                </TableHead>

                                {/* Body */}
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                                <CircularProgress size='3rem' />
                                                <Typography variant="body2" sx={{ marginTop: 2 }}>
                                                    Loading party data...
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredPartyWise.length > 0 ? (
                                        filteredPartyWise.map((item, index) => (
                                            <TableRow
                                                key={item.PARTY_KEY || `${item.PARTY_NAME}-${index}`}
                                                hover
                                                onDoubleClick={() => handleRowDoubleClick(item)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    backgroundColor: item.PARTY_NAME === selectedParty
                                                        ? '#dce4daff'
                                                        : 'inherit',
                                                    transition: 'background-color 0.3s ease',
                                                    '&:hover': {
                                                        backgroundColor: item.PARTY_NAME === selectedParty
                                                            ? '#d4dad3ff'
                                                            : 'rgba(0, 0 0 / 0.04)',
                                                    },
                                                }}
                                            >
                                                <TableCell sx={{ padding: '2px 16px' }}>{item.PARTY_NAME || '-'}</TableCell>
                                                <TableCell sx={{ padding: '2px 16px' }}>{item.CITY_NAME || '-'}</TableCell>
                                                <TableCell sx={{ padding: '2px 16px' }}>{item.STATE_NAME || '-'}</TableCell>
                                                <TableCell sx={{ padding: '2px 16px' }}>
                                                    {parseFloat(item.AMOUNT || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                                </TableCell>
                                                <TableCell sx={{ padding: '2px 16px' }}>{parseFloat(item.QTY || 0).toLocaleString('en-IN')}</TableCell>
                                                <TableCell sx={{ padding: '2px 16px' }}>{item.BROKER_NAME || '-'}</TableCell>
                                                <TableCell sx={{ padding: '2px 16px' }}>{item.SALEPERSON_NAME || '-'}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {searchTermParty ? 'No matching parties found.' : 'No party data available.'}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>

                                {/* Sticky Footer with Totals */}
                                <TableFooter>
                                    <TableRow
                                        sx={{
                                            position: 'sticky',
                                            bottom: 0,
                                            zIndex: 9,
                                            backgroundColor: 'rgba(200, 202, 204, 1)',
                                            '& > td': {
                                                fontWeight: 'bold',
                                                borderTop: '1px solid #4caf50',
                                                py: 0.2,
                                            },
                                        }}
                                    >
                                        <TableCell colSpan={3} align="left" sx={{ fontWeight: 'bold', color: '#000' }}>
                                            Total
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>
                                            {filteredPartyWise
                                                .reduce((sum, item) => sum + parseFloat(item.AMOUNT || 0), 0)
                                                .toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>
                                            {filteredPartyWise
                                                .reduce((sum, item) => sum + parseFloat(item.QTY || 0), 0)
                                                .toLocaleString('en-IN')}
                                        </TableCell>
                                        <TableCell colSpan={2} />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>

            {/* State wise order summary */}
            <Grid container spacing={2} sx={{ height: '100%', mt: 2 }}>
                <Grid size={{ xs: 12, md: 12 }} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Paper
                        elevation={5}
                        sx={{
                            p: 1.5,
                            borderRadius: 4,
                            bgcolor: 'white',
                            boxShadow: '0 10px 30px rgb(0 0 0 / 0.12)',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                sx={{
                                    background: 'linear-gradient(45deg, #076ec2, #05920a)',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                    fontSize: '1.25rem',
                                    letterSpacing: 0.5,
                                }}
                            >
                                State Wise Orders Summary
                            </Typography>

                            <TextField
                                variant="outlined"
                                size="small"
                                sx={{
                                    width: 250,
                                    borderRadius: '9px',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '20px',
                                        padding: '4px 10px',
                                        height: '32px',
                                    },
                                    '& .MuiInputLabel-root': {
                                        borderRadius: '9px',
                                        fontSize: '0.875rem',
                                        top: '-6px',
                                    },
                                }}
                                value={searchTermState}
                                onChange={(e) => setSearchTermState(e.target.value)}
                                placeholder="Search by State, Amount, Qty, etc."
                                InputProps={{
                                    style: {
                                        padding: '0px 10px',
                                    },
                                }}
                            />
                        </Box>

                        <TableContainer sx={{ flexGrow: 1, maxHeight: 250, overflow: 'auto' }}>
                            <Table stickyHeader size="small" aria-label="state wise orders">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#fff', backgroundColor: '#66a6afff', padding: '2px 16px' }}>State</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#fff', backgroundColor: '#66a6afff', padding: '2px 16px' }}>Amount</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#fff', backgroundColor: '#66a6afff', padding: '2px 16px' }}>Qty</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#fff', backgroundColor: '#66a6afff', padding: '2px 16px' }}>BalQty</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#fff', backgroundColor: '#66a6afff', padding: '2px 16px' }}>SaleQty</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#fff', backgroundColor: '#66a6afff', padding: '2px 16px' }}>Qty%</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredStateWise.length > 0 ? (
                                        filteredStateWise.map((item) => {
                                            const totalQty = filteredStateWise.reduce((sum, i) => sum + parseFloat(i.QTY || 0), 0);
                                            const qtyPercentage = totalQty > 0
                                                ? ((parseFloat(item.QTY || 0) / totalQty) * 100).toFixed(2)
                                                : "0.00";

                                            return (
                                                <TableRow
                                                    // key={item.ORDBK_NO}
                                                    key={item.STATE_NAME || index}
                                                    hover
                                                    onDoubleClick={() => handleRowDoubleClick(item)}
                                                    sx={{
                                                        backgroundColor: item.STATE_NAME === selectedState
                                                            ? '#bbdefb'
                                                            : 'inherit',
                                                        transition: 'background-color 0.3s ease',
                                                        '&:hover': {
                                                            backgroundColor: item.STATE_NAME === selectedState
                                                                ? '#90caf9'
                                                                : 'rgba(0, 0, 0, 0.04)',
                                                        },
                                                    }}
                                                >
                                                    <TableCell sx={{ padding: '2px 15px' }}>{item.STATE_NAME}</TableCell>
                                                    <TableCell sx={{ padding: '2px 15px' }}>{item.AMOUNT}</TableCell>
                                                    <TableCell sx={{ padding: '2px 15px' }}>{item.QTY}</TableCell>
                                                    <TableCell sx={{ padding: '2px 15px' }}>{item.BAL_QTY}</TableCell>
                                                    <TableCell sx={{ padding: '2px 15px' }}>{item.SALE_QTY}</TableCell>
                                                    <TableCell sx={{ padding: '2px 15px' }}>{qtyPercentage + "%"}</TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">No records found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                                <TableFooter>
                                    <TableRow sx={{ position: 'sticky', bottom: 0, zIndex: 9, '& > td': { fontWeight: 'bold', borderTop: '1px solid #8e90a8', py: 0.2, color: '#000', bgcolor: '#c0bcbcff' } }}>
                                        <TableCell colSpan={1} align="left" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                        <TableCell align="left">
                                            {filteredStateWise.reduce((sum, item) => sum + parseFloat(item.AMOUNT || 0), 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell align="left">
                                            {filteredStateWise.reduce((sum, item) => sum + parseFloat(item.QTY || 0), 0).toLocaleString('en-IN')}
                                        </TableCell>
                                        <TableCell align="left">
                                            {filteredStateWise.reduce((sum, item) => sum + parseFloat(item.BAL_QTY || 0), 0).toLocaleString('en-IN')}
                                        </TableCell>
                                        <TableCell align="left">
                                            {filteredStateWise.reduce((sum, item) => sum + parseFloat(item.SALE_QTY || 0), 0).toLocaleString('en-IN')}
                                        </TableCell>
                                        <TableCell align="left">100.00%</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>

            <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth='lg' fullWidth>
                <Box display='flex' justifyContent='space-between'>
                    <DialogTitle sx={{ padding: '10px !important' }}>Order Document</DialogTitle>
                    <DialogActions>
                        <Button onClick={handleCloseModal}><CloseIcon color="error" /></Button>
                    </DialogActions>
                </Box>
                <PDFViewer width='100%' height='800px'>
                    {selectedOrder && <OrderDocument orderDetails={selectedOrder} />}
                </PDFViewer>
            </Dialog>

            <Grid container spacing={2} mt={2}>
                <Grid size={{ xs: 12, md: 12 }}>
                    <Paper elevation={5} sx={{ p: 2, borderRadius: 2, height: 300 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Order vs Sales
                        </Typography>
                        <Box sx={{ width: '100%', height: '100%' }}>
                            <ResponsiveContainer width="100%" height="90%">
                                <ComposedChart data={salesPerson} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                    <XAxis dataKey="month" />
                                    <YAxis
                                        tickLine={true}
                                        axisLine={true}
                                        yAxisId="left"
                                        label={{
                                            value: 'Quantity (L)',
                                            angle: -90,
                                            position: 'insideLeft'
                                        }}
                                    />
                                    <YAxis
                                        tickLine={true}
                                        axisLine={true}
                                        yAxisId="right"
                                        orientation="right"
                                        label={{
                                            value: 'Amount (L)',
                                            angle: 90,
                                            position: 'insideRight'
                                        }}
                                    />
                                    <Tooltip
                                        formatter={(value, name) => {
                                            if (name === 'amt') {
                                                return [value.toLocaleString('en-US') + ' L', 'Amount (L)'];
                                            } else if (name === 'qty') {
                                                return [value.toLocaleString('en-US') + ' L', 'Quantity (L)'];
                                            }
                                            return value;
                                        }}
                                    />
                                    <Legend verticalAlign="top" height={36} />
                                    <Bar
                                        yAxisId="left"
                                        dataKey="qty"
                                        name="Quantity (L)"
                                        barSize={40}
                                        fill="#1976d2"
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="amt"
                                        name="Amount (L)"
                                        stroke="#ff7f50"
                                        strokeWidth={3}
                                        dot={{ r: 5 }}
                                        activeDot={{ r: 7 }}
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
                    <Paper
                        elevation={6}
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            height: 460,
                            backgroundColor: theme.palette.mode === 'dark' ? '#1f1f1f' : '#fefefe',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.08)",
                        }}
                    >
                        {/* Title and Total Quantity */}
                        <Box
                            sx={{
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Orders Trend
                            </Typography>

                            {/* Animated Total Quantity */}
                            <Box textAlign="right">
                                <Typography variant="h4" fontWeight="bold" color="primary">
                                    <span style={{ fontSize: '25px' }}>📝</span> <CountUp end={totalSales} duration={20} separator="," />
                                </Typography>
                                <Typography color="text.secondary" fontSize={14}>
                                    Total Order Quantity of This Period
                                </Typography>
                            </Box>
                        </Box>

                        {/* Chart Area */}
                        <Box sx={{ width: '100%', height: '80%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={chartData}
                                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="qtyGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1976d2" stopOpacity={0.6} />
                                            <stop offset="95%" stopColor="#1976d2" stopOpacity={0.05} />
                                        </linearGradient>
                                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#42a5f5" />
                                            <stop offset="100%" stopColor="#1e88e5" />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid strokeDasharray="4 4" stroke="#e0e0e0" opacity={0.4} />

                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 13, fontWeight: 500 }}
                                        tickMargin={10}
                                    />

                                    <YAxis
                                        tick={{ fontSize: 13, fontWeight: 500 }}
                                        tickFormatter={(value) =>
                                            value >= 100000
                                                ? `${(value / 100000).toFixed(1)}L`
                                                : value >= 1000
                                                    ? `${(value / 1000).toFixed(0)}k`
                                                    : value
                                        }
                                    />

                                    <Tooltip
                                        formatter={(value) => `${Number(value).toLocaleString('en-IN')}`}
                                        labelFormatter={(label) => `Month: ${label}`}
                                        contentStyle={{
                                            borderRadius: '10px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: '1px solid #1976d2',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        }}
                                        itemStyle={{ color: '#1976d2', fontWeight: 600 }}
                                    />

                                    <Legend
                                        wrapperStyle={{ paddingTop: '10px' }}
                                        iconType="line"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="sales"
                                        name="Quantity"
                                        stroke="url(#lineGradient)"
                                        strokeWidth={3}
                                        fill="url(#qtyGradient)"
                                        dot={{
                                            r: 6,
                                            fill: '#1976d2',
                                            stroke: '#fff',
                                            strokeWidth: 2,
                                        }}
                                        activeDot={{ r: 8 }}
                                        isAnimationActive={true}
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SalesDashboard;