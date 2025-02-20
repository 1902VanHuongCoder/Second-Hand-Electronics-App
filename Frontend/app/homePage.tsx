import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableHighlight, StyleSheet } from 'react-native';
import axios from 'axios';

export default function HomePage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://10.0.2.2:5000/api/home');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <ScrollView style={styles.container}>
            {products.length > 0 ? (
                products.map(({ laptop, product, ram, screen }) => (
                    <TouchableHighlight key={laptop._id} style={styles.card}>
                        <View style={styles.cardContent}>
                            <Text style={styles.title}>Laptop: {laptop.title}</Text>
                            <Text style={styles.battery}>Battery: {laptop.battery}</Text>
                            <Text style={styles.ram}>RAM: {ram ? ram.ramCapacity : 'N/A'}</Text>
                            <Text style={styles.screen}>Screen: {screen ? screen.screenSize : 'N/A'}</Text>
                            <Text style={styles.productTitle}>Product: {product.title}</Text>
                            <Text style={styles.description}>Description: {product.description}</Text>
                            <Text style={styles.price}>Price: {product.price} VND</Text>
                        </View>
                    </TouchableHighlight>
                ))
            ) : (
                <Text style={styles.loading}>Loading products...</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardContent: {
        flexDirection: 'column',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    battery: {
        fontSize: 14,
        color: '#666',
    },
    ram: {
        fontSize: 14,
        color: '#666',
    },
    screen: {
        fontSize: 14,
        color: '#666',
    },
    productTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 8,
    },
    description: {
        fontSize: 14,
        color: '#333',
    },
    price: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#9661D9',
        marginTop: 4,
    },
    loading: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#999',
    },
});
