import React, { useState } from 'react';
import dayjs from 'dayjs';
import { useAddFriendMutation, useGetCategoriesQuery } from 'features/api/apiSlice';
import SendIcon from '@mui/icons-material/Send';
import { FormControl, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export const AddFriendForm = ({ handleClose }) => {
  const [friendName, setFriendName] = useState('');
  const [desiredContactFrequency, setDesiredContactFrequency] = useState(7);
  const [lastContactDate, setLastContactDate] = useState(dayjs());
  const [lastContactType, setLastContactType] = useState('');
  const [category, setCategory] = useState('');

  const [addFriend] = useAddFriendMutation();

  const onFriendNameChanged = (e) => setFriendName(e.target.value);
  const onLastContactTypeChanged = (e) => setLastContactType(e.target.value);
  const onDesiredContactFrequencyChanged= (e) => setDesiredContactFrequency(e.target.value);
  const onCategoryChanged = (e) => setCategory(e.target.value);

  const canSave = [friendName, desiredContactFrequency, lastContactDate, lastContactType, category].every(Boolean);

  const onAddFriendClicked = async() => {
    if (canSave) {
      try {
        await addFriend({
          name: friendName,
          desiredContactFrequency,
          lastContactDate: lastContactDate.format('YYYY-MM-DD'),
          lastContactType,
          categoryId: category
        }).unwrap();
        setFriendName('');
        setDesiredContactFrequency(7);
        setLastContactDate(dayjs());
        setLastContactType('');
        setCategory('');
      } catch (err) {
        console.log('failed to add friend', err);
      } finally {
        handleClose();
      }
    }
  };


  const {
    data: categories,
    isLoading: categoriesLoading
  } = useGetCategoriesQuery();

  return (
    categoriesLoading ?
      'Loading...' :
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="section" sx={{ maxWidth: 300, margin: 5, gap: 2 }}>
        <h2>Add a New Friend</h2>
        <Stack
          component="form"
          sx={{
            width: '25ch'
          }}
          spacing={2}
          autoComplete="off"
        >
          <TextField
            id="name"
            label="Name"
            value={friendName}
            onChange={onFriendNameChanged}
            sx={{ margin: 2 }}
            required={true}
          />
          <DatePicker
            label="Last contact"
            value={lastContactDate}
            onChange={(newLastContactDate) => setLastContactDate(newLastContactDate)}
            sx={{ margin: 2 }}
          />
          <TextField
            id="lastContactType"
            label="Last contact type"
            value={lastContactType}
            onChange={onLastContactTypeChanged}
            sx={{ margin: 2 }}
            required={true}
          />
          <TextField
            id="desiredContactFrequency"
            label="Desired Contact Frequency"
            value={desiredContactFrequency}
            onChange={onDesiredContactFrequencyChanged}
            type="number"
            min={0}
            max={365}
            InputProps={{
              endAdornment: <InputAdornment position="start">days</InputAdornment>
            }}
            sx={{ margin: 2 }}
            required={true}
          />
          <FormControl fullWidth={true} sx={{ margin: 2 }}>
            <InputLabel id="categoryLabel">Category</InputLabel>
            <Select
              id="category"
              label="Category"
              value={category}
              onChange={onCategoryChanged}
            >
              {categories.map((categoryOption) => (
                <MenuItem value={categoryOption.id} key={categoryOption.id}>
                  {categoryOption.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={onAddFriendClicked}
            disabled={!canSave} endIcon={<SendIcon />}
          >
            Add Friend
          </Button>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};
