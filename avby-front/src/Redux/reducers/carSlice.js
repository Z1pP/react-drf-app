import {createSlice} from '@reduxjs/toolkit'

const initialState ={
    carList: [],
    car: {},
    totalCars: 0,
    loading: true
}

export const carSlice = createSlice({
    name: 'cars',
    initialState,
    reducers: {
        loadCars: (state, action) => {
            state.carList = [...state.carList, ...action.payload.cars]
            state.totalCars = action.payload.totalCars
            state.loading = false
        },
        loadCarById: (state, action) => {
            state.car = action.payload
            state.loading = false
        },
        setTotalCars: (state, action) => {
            state.totalCars = action.payload
        },
        setFilter: (state, action) => {
            state.filter = action.payload
        },
        clearCars: (state) => {
            state.carList = []
        }
    }
})

export const { loadCars, loadCarById, setTotalCars, setFilter, clearCars } = carSlice.actions

export default carSlice.reducer
