import React from 'react';  
import { View, FlatList, Text, StyleSheet, Image } from 'react-native';  

const DATA = [  
  { id: '1', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkdPFA6r_IbzQJcyXrKT5TSritv0S_iWwFmw&s' },  
  { id: '2', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-C_UAhXq9GfuGO452EEzfbKnh1viQB9EDBQ&s' },  
  { id: '3', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm1iZJ_ED3vHJpNJNdSZHvZKGTREq1YEymsg&s' },  
];  

const Carousel = () => {  
  return (  
    <FlatList  
      data={DATA}  
      renderItem={({ item }) => (  
        <View style={styles.item}>  
          <Image source={{ uri: item.url }} style={{ width: 300, height: 200 }} /> 
        </View>  
      )}  
      keyExtractor={item => item.id}  
      horizontal  
      pagingEnabled  
    />  
  );  
};  

const styles = StyleSheet.create({  
  item: {  
    width: 300,  
    height: 200,  
    justifyContent: 'center',  
    alignItems: 'center',  
    backgroundColor: '#f9c2ff',  
    margin: 10,  
  },  
});  

export default Carousel;