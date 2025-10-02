import { Text, TouchableOpacity, View } from "react-native";
import React from "react";

const IssueCard2 = ({ title, desc, date, time, vote }: any) => {
  return (
    <TouchableOpacity
      style={{
        height: 90,
        width: "90%",
        backgroundColor: "#e6e6ebff",
        borderRadius: 15,
        padding: 5,
        elevation: 3,
        margin: 10,
      }}
    >
      <View style={{
        flexDirection:'row',
        justifyContent:'space-between'
      }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: 500,
            marginBottom:3,
          }}
        >
          {title}
        </Text>
        <Text style={{
            fontSize:10,
            marginRight:10,
            marginTop:5,
        }}>Status</Text>
      </View>

      <Text
        style={{
          fontSize: 12,
          fontWeight: 400,
        }}
        numberOfLines={3}
      >
        {desc}
      </Text>
      <Text
        style={{
          fontSize: 10,
          fontWeight: 500,
        }}
      >
        Date : {date}
      </Text>
    </TouchableOpacity>
  );
};

export default IssueCard2;
