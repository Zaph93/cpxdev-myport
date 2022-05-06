import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import en from '../lang/en/hob.json';
import th from '../lang/th/hob.json';
import Iframe from 'react-iframe'
import { Dialog } from '@material-ui/core';
import Fav from '../component/fav'
import axios from 'axios';
import Fet from '../fetch'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';


import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';
import Swal from 'sweetalert2'

let pm = new Audio();
let time;
const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    cardroot: {
      width: '100%',
      display: 'flex',
    },
    loader: {
      paddingTop: theme.spacing(2),
      textAlign: 'center',
      alignContent: 'center',
      justifyContent: "center"
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      marginTop: 20,
      flex: '1 0',
    },
    cover: {
      width: 151,
    }, 
    imgstar: {
      textAlign: 'center',
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    playIcon: {
      height: 38,
      width: 38,
    },
    headingst: {
        fontSize: theme.typography.pxToRem(17),
        fontWeight: theme.typography.fontWeightRegular,
      }
  }));
const Hob = ({setP}) => {
  React.useEffect(() => {
    setP(localStorage.getItem('langconfig') !== null && localStorage.getItem('langconfig') == 'th' ? th.title : en.title)
  }, [])
    const [Lang, setLang] = useState(th);
    const [isOpen, setOpen] = React.useState(false);
    const [muted, setMuted] = React.useState(localStorage.getItem('mutedsample') != null ? true:false);
    const [music, setMusic] = React.useState([]);
    const [arr, setArr] = useState( {
      title: "",
      src: "",
      vdo: "",
      desc: ""
    })
      const [expanded, setExpanded] = React.useState(false);

      const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
      };
    const syncpage = () => {
      if (localStorage.getItem('langconfig') !== null) {
        if (localStorage.getItem('langconfig') === 'th') {
          setLang(th);
        } else {
          setLang(en);
        }
      }
    };
    const classes = useStyles();
    React.useEffect(() => {
      syncpage();
    });

    React.useEffect(() => {
      if (muted) {
        localStorage.setItem('mutedsample', true)
      } else {
        localStorage.removeItem('mutedsample')
      }
    }, [muted])

    React.useEffect(() => {
      var de = setInterval(function(){ 
        if (Fet().ul !== '') {
            clearInterval(de)
            if (localStorage.getItem('langconfig') !== null) {
              if (localStorage.getItem('langconfig') === 'th') {
                  axios({
                    method: 'post',
                    url: Fet().ul + '/myportsite/spotsync?pid=' + th.playlist,
                  }).then(function (response) {
                    setMusic(response.data.res.items)
                })
                .catch(function () {
                    // handle error
                });
              } else {
                  axios({
                    method: 'post',
                    url: Fet().ul + '/myportsite/spotsync?pid=' + en.playlist,
                  }).then(function (response) {
                    setMusic(response.data.res.items)
                })
                .catch(function () {
                    // handle error
                });
              }
            }
        }
    }, 1);
    }, [])

    const PlaySample = (item) => {
      if (pm.paused && !muted) { 
        time = setTimeout(() => {
          clearTimeout(time);
          pm = new Audio(item.track.preview_url)
          pm.play()
          if ('mediaSession' in navigator) {
              navigator.mediaSession.metadata = new window.MediaMetadata({
                  title: '[Preview] ' + item.track.name,
                  artist: item.track.artists[0].name,
                  artwork: [
                      { src: item.track.album.images[0].url, sizes: '500x500' },
                  ]
              });
          }
        }, 800);
      }
    }
   

    React.useEffect(() => {
      if (Fet().ul !== '') {
        axios({
          method: 'post',
          url: Fet().ul + '/myportsite/spotsync?pid=' + Lang.playlist,
        }).then(function (response) {
          setMusic(response.data.res.items)
      })
      .catch(function () {
          // handle error
      });
    }
    }, [Lang.playlist])

    const Notsupport = () => {
      if (!muted) {
        Swal.fire({
          title: localStorage.getItem('langconfig') !== null && localStorage.getItem('langconfig') == 'th' ? 'การเล่นตัวอย่างเพลงไม่สนับสนุนบนอุปกรณ์พกพาหรือโทรศัพท์มือถือ' : 'Preview song is not support on Tablet or mobile devices',
          icon: 'error',
        })
      }
    }

    return (
        <div>
          <Slide direction="right" in={true} timeout={localStorage.getItem('graphic') === null ? 600 : 0}>
            <Typography gutterBottom variant="h5" component="h2">
              {Lang.title}
            </Typography>
          </Slide>
            <hr/>
          <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
            <Grow in={true} timeout={localStorage.getItem('graphic') === null ? 1400 : 0}>
              <Typography variant="h6" className={classes.headingst}>{Lang.title1}</Typography>
            </Grow>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                {Lang.hoblist}
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
            <Grow in={true} timeout={localStorage.getItem('graphic') === null ? 1400 : 0}>
              <Typography variant="h6" className={classes.headingst}>{Lang.title2}</Typography>
            </Grow>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                {Lang.favlist.map((fav, i) => i !== Lang.favlist.length - 1 ? (
                  <g key={i} className="remove-ude" onClick={() => {
                    setArr(fav);
                    setOpen(true);
                  }}>
                    {fav.title},&nbsp;
                  </g>
                ) : (
                  <g className="remove-ude" onClick={() => {
                    setArr(fav);
                    setOpen(true);
                  }}>
                    {fav.title}
                  </g>
                ))}
              </Typography> 
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
            <Grow in={true} timeout={localStorage.getItem('graphic') === null ? 1400 : 0}>
              <Typography variant="h6" className={classes.headingst}>{Lang.title3}</Typography>
            </Grow>
            </AccordionSummary>
            <AccordionDetails>
            <List className='row'>
            {muted ? (
               <ListItem className='col-md-12 mb-3' button onClick={() => setMuted(!muted)}>
               <ListItemAvatar>
               <VolumeOffIcon />
               </ListItemAvatar>
               <ListItemText primary={(Lang.tag == 'th' ? 'ตัวอย่างเพลงถูกปิด' : 'Sound are muted')} />
             </ListItem>
            ):(
              <ListItem className='col-md-12 mb-3' button onClick={() => setMuted(!muted)}>
              <ListItemAvatar>
              <VolumeUpIcon />
              </ListItemAvatar>
              <ListItemText primary= {(Lang.tag == 'th' ? 'ตัวอย่างเพลงถูกเล่นเมื่อมีการเลื่อนไปที่กล่องชื่อเพลงนั้น' : 'Sound are played when hover')} />
            </ListItem>
            )}
              {music.length > 0 && music.map((item, i) => (
                <ListItem className='col-md-4' button onMouseEnter={() => window.innerWidth > 900 ? PlaySample(item) : Notsupport()} onMouseLeave={() => {pm.pause() ; clearTimeout(time)}}>
                  <ListItemAvatar>
                    <Avatar src={item.track.album.images[0].url} variant={'rounded'} style={{width: 90 , height: 90}} onClick={() => window.open(item.track.artists[0].external_urls.spotify,'blank').focus()} /> 
                  </ListItemAvatar>
                  <div className='ml-3'>
                  <ListItemText primary={item.track.name} secondary={(Lang.tag == 'th' ? 'ร้องโดย ' : 'Song by ') + item.track.artists[0].name} onClick={() => window.open(item.track.external_urls.spotify,'blank').focus()} />
                  </div>
                </ListItem>
              ))}
              {music.length > 0 && (
              <Typography className='mt-3 text-muted'>{Lang.musicguide}</Typography>
              )}
              </List>
            </AccordionDetails>
          </Accordion>
          
          <Dialog
            TransitionComponent={Grow}
            transitionDuration={localStorage.getItem('graphic') === null ? 500 : 200}
            open={isOpen}
            onClose={() => setOpen(false)}
            maxWidth="lg"
            scroll={'paper'}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
          >
            <Fav
              arr={arr}
              setOpen={(param) => setOpen(param)}
              Lang={Lang}
              classes={classes}
            />
          </Dialog>
        </div>
     );
}
 
export default Hob;