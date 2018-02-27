import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
  ScrollView
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { fetchMyNews } from '../utils/utils';

class MyNewsScreen extends React.Component {
  constructor(props) {
    console.log("HERE");
    super(props);

    this.state = {
      selectedIdx: 0
    };
  }

  componentDidMount() {
    console.log("componentDidMount:MyNewsScreen");
    if (!this.props.session) {
      // return window.location.hash = "";
      console.log("HERE1");
      return;
    }

    // It may be that we startup in a logged in state and then we get here this one time and get the news
    fetchMyNews(this.props.dispatch, this.props.session.userId, this.props.session.token);
  }

  // handleChangeFilter = (event) => {
  //   this.setState({ selectedIdx: parseInt(event.target.value, 10) });
  // }

  onStoryPress = (story) => {
    WebBrowser.openBrowserAsync(story.link);
  };

  onNYTPress = () => {
    WebBrowser.openBrowserAsync('https://developer.nytimes.com');
  };

  render() {
    if (!this.props.session) {
      console.log("render no session");
      return (
        <View>
          <Text>Not currently logged in</Text>
        </View>
      );
    }

    if (this.state.isLoading || !this.props.newsFilters || this.props.newsFilters.length==0) {
      console.log("render loading or something");
      return (
        <View>
          <Text>Loading home page news...</Text>
        </View>
      );
    }

    let TouchableElement = TouchableHighlight;

    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    // For the Image try resizeMode="contain" and "cover"

    console.log("HERE99");
    // console.log(this.props);
    // console.log(this.props.newsFilters);
    // console.log(this.props.newsFilters.length);
    // console.log(this.state.selectedIdx);
    // console.log(this.props.newsFilters[this.state.selectedIdx].newsStories);
    // console.log(this.props.newsFilters[this.state.selectedIdx].newsStories.length);

    return (
      <View>
        <ScrollView>
          {this.props.newsFilters[this.state.selectedIdx].newsStories.map((newsStory, idx) =>
            <TouchableElement key={idx} onPress={() => this.onStoryPress(newsStory)}>
              <View style={styles.row}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: newsStory.imageUrl }} style={styles.storyImage} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.storyTitle} numberOfLines={2}>
                    {newsStory.title}
                  </Text>
                  <Text style={styles.storySnippet} numberOfLines={3}>
                    {newsStory.contentSnippet}
                  </Text>
                  <Text style={styles.storySourceHours}>
                    {newsStory.source} - {newsStory.hours}
                  </Text>
                </View>
              </View>
            </TouchableElement>
          )}
          <TouchableElement key={this.props.newsFilters[this.state.selectedIdx].newsStories.length} onPress={() => this.onNYTPress()}>
            <View style={styles.row}>
              <Image source={require('../assets/images/poweredby_nytimes_30b.png')} />
              <View style={styles.textContainer}>
                <Text style={styles.storyTitle} numberOfLines={2}>
                  Data provided by The New York Times
                </Text>
              </View>
            </View>
          </TouchableElement>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    borderStyle: 'solid',
    borderBottomColor: '#dddddd',
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: 5,
  },
  imageContainer: {
    backgroundColor: '#dddddd',
    width: 90,
    height: 90,
    marginRight: 10
  },
  textContainer: {
    flex: 1,
  },
  storyImage: {
    width: 90,
    height: 90,
  },
  storyTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  storySnippet: {
    fontSize: 12,
    marginTop: 5,
    marginBottom: 5,
  },
  storySourceHours: {
    fontSize: 12,
    color: 'gray',
  },
});

MyNewsScreen.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  console.log("MyNewsScreen::mapStateToProps called");
  return {
    session: state.app.session,
    newsFilters: state.news.newsFilters,
    isLoading: state.news.isLoading
  }
}

export default connect(mapStateToProps)(MyNewsScreen)