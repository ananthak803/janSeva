import {  Text, TouchableOpacity } from 'react-native'
import React from 'react'

const IssueCard = ({title,desc,date,time,vote}:any) => {
  return (
    <TouchableOpacity style={{
        height:'90%',
        width:120,
        backgroundColor:'#e6e6ebff',
        borderRadius:15,
        padding:5,
        elevation:3,
    }}>
        <Text style={{
            fontSize:15,
            fontWeight:500,
        }}>{title}</Text>
        <Text style={{
            fontSize:10,
            fontWeight:500,
        }}>Date: {date}</Text>
        <Text style={{
            fontSize:10,
            fontWeight:500,
        }}>Votes: {vote}</Text>
    </TouchableOpacity>
  )
}

export default IssueCard