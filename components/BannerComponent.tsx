
import React, { useRef, useState, useEffect } from 'react';
import { View, FlatList, Dimensions, StyleSheet, TouchableOpacity, Pressable,Image } from 'react-native';
import { responsiveHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';
 // Import Image from expo-image

const { width } = Dimensions.get('window');
const IMAGE_WIDTH = width * 0.9;
const IMAGE_HEIGHT = responsiveHeight(45);
const SPACING = 8;
const AUTO_SCROLL_INTERVAL = 5000;
const MANUAL_SCROLL_DELAY = 3000;

const BannerComponent = ({ images, h }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);
    const scrollTimeout = useRef(null);
    const scrollInProgress = useRef(false); // New ref to prevent overscroll

    // Duplicate the images array to create an infinite loop
    const loopedImages = [...images, ...images, ...images];

    useEffect(() => {
        // Scroll to the first image in the looped array initially
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({ animated: false, index: images.length });
        }
    }, []);

    useEffect(() => {
        startAutoScroll();

        return () => {
            clearManualScrollTimeout();
        };
    }, [activeIndex]);

    const startAutoScroll = () => {
        clearManualScrollTimeout(); // Clear any existing intervals
        scrollTimeout.current = setTimeout(() => {
            if (flatListRef.current && !scrollInProgress.current) {
                const nextIndex = (activeIndex + 1) % images.length;
                flatListRef.current.scrollToIndex({ animated: true, index: nextIndex + images.length });
                setActiveIndex(nextIndex);
            }
        }, AUTO_SCROLL_INTERVAL);
    };

    const clearManualScrollTimeout = () => {
        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
            scrollTimeout.current = null;
        }
    };

    const resumeAutoScrollAfterDelay = () => {
        clearManualScrollTimeout();
        scrollTimeout.current = setTimeout(() => {
            startAutoScroll();
        }, MANUAL_SCROLL_DELAY);
    };

    const renderItem = ({ item }) => (
        <Pressable onPress={() => {

        }} style={[styles.imageContainer, { height: h }]}>
            <Image
                source={{ uri: item.img}}
                style={styles.image}
                resizeMode='stretch'
            />
        </Pressable>
    );

    const onViewRef = React.useRef((viewableItems) => {
        if (viewableItems.viewableItems.length > 0) {
            let index = viewableItems.viewableItems[0].index;
            if (index >= images.length && index < loopedImages.length - images.length) {
                index = index - images.length;
            }
            setActiveIndex(index);
        }
    });

    const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

    const handleMomentumScrollEnd = (event) => {
        scrollInProgress.current = false;
        const offsetX = event.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(offsetX / (IMAGE_WIDTH + SPACING));

        if (currentIndex >= loopedImages.length - images.length) {
            flatListRef.current.scrollToIndex({ animated: false, index: images.length });
        } else if (currentIndex < images.length) {
            flatListRef.current.scrollToIndex({ animated: false, index: loopedImages.length - (images.length * 2) });
        }

        const newActiveIndex = currentIndex % images.length;
        setActiveIndex(newActiveIndex);
    };

    const handleScrollBeginDrag = () => {
        scrollInProgress.current = true;
        clearManualScrollTimeout(); // Pause auto-scroll when user starts dragging
    };

    const handleScrollEndDrag = () => {
        resumeAutoScrollAfterDelay(); // Resume auto-scroll after the user stops dragging
    };

    const handlePressIndicator = (index) => {
        clearManualScrollTimeout(); // Pause auto-scroll
        flatListRef.current.scrollToIndex({ animated: true, index: index + images.length });
        setActiveIndex(index);
        resumeAutoScrollAfterDelay(); // Resume auto-scroll after a delay
    };

    return (
        <View style={{ marginTop: 10, marginBottom: 10 }}>
            <FlatList
                ref={flatListRef}
                data={loopedImages}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled={true}  // disable default paging
                snapToAlignment="start"
                snapToInterval={IMAGE_WIDTH + SPACING}
                contentContainerStyle={{ paddingHorizontal: (width - IMAGE_WIDTH) / 2.4, marginTop: 5 }}
                onViewableItemsChanged={onViewRef.current}
                viewabilityConfig={viewConfigRef.current}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                getItemLayout={(data, index) => (
                    { length: IMAGE_WIDTH + SPACING, offset: (IMAGE_WIDTH + SPACING) * index, index }
                )}
                onScrollBeginDrag={handleScrollBeginDrag}
                onScrollEndDrag={handleScrollEndDrag}
            />
            {/* <View style={styles.indicatorContainer}>
                {images.map((_, index) => (
                    <TouchableOpacity key={index} onPress={() => handlePressIndicator(index)}>
                        <View style={[
                            styles.indicator,
                            { backgroundColor: index === activeIndex ? '#FF204E' : '#ccc' }
                        ]} />
                    </TouchableOpacity>
                ))}
            </View> */}
        </View>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        marginHorizontal: SPACING / 2,
        overflow: 'hidden',
        borderRadius: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    indicator: {
        width: responsiveScreenWidth(2.5),
        height: responsiveScreenWidth(2.5),
        borderRadius: 8,
        backgroundColor: '#333',
        marginHorizontal: 5,
    },
});

export default BannerComponent;
