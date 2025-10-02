import { StyleSheet, Text, TextInput, View, Button } from "react-native";
import React, { useState } from "react";
import CustomSafeArea from "@/src/components/CustomSafeArea";
import { Picker } from "@react-native-picker/picker";

const Report = () => {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    console.log({ title, description, category });
  };

  return (
    <CustomSafeArea edge={["left", "right", "top"]}>
      <View style={styles.main}>
        <Text style={styles.heading}>Submit your Issue</Text>
        <TextInput 
          style={styles.titleInput} 
          placeholder="Enter issue title" 
          value={title} 
          onChangeText={setTitle} 
        />
        <TextInput 
          style={styles.descriptionInput} 
          placeholder="Describe the issue in detail" 
          value={description} 
          onChangeText={setDescription} 
          multiline 
        />
        <View style={styles.pickerContainer}>
  <Picker
    selectedValue={category}
    onValueChange={(itemValue) => setCategory(itemValue)}
    style={styles.picker}
    mode="dropdown"
  >
    <Picker.Item label="Select a category" value="" />
    <Picker.Item label="Roads" value="roads" />
    <Picker.Item label="Water" value="water" />
    <Picker.Item label="Power" value="power" />
    <Picker.Item label="Sanitation" value="sanitation" />
    <Picker.Item label="Others" value="others" />
  </Picker>
</View>
        <Button title="Submit Issue" onPress={handleSubmit} />
      </View>
    </CustomSafeArea>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 15,
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    marginBottom: 20,
  },
  titleInput: {
    height: 50,
    width: "90%",
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
  },
  descriptionInput: {
    height: 150,
    width: "90%",
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    textAlignVertical: 'top',
  },
  pickerContainer: {
  width: "90%",
  borderWidth: 1,
  borderRadius: 10,
  marginBottom: 25,
},
picker: {
  height: 50,
  width: "100%",
},
});

export default Report;
