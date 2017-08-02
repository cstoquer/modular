
![modularlogo](https://cloud.githubusercontent.com/assets/2462139/22728956/d35dafa2-ee23-11e6-92d0-35c3ee9c479f.png)

# webAudio doodle

*Modular* is a cool interface to easily create and test webAudio routing configurations.
Similar to an analog modular synthesizer, you add *modules* in a *patch*.
A module can be a simple webAudio feature or a more complex configuration
and can holds some controls in the form of *knob*, *button*, etc.
Then, the modules can simply be connected together with cables.

UI is strongly influenced by Clavia's *Nord Modular*'s editor.

![modular](https://cloud.githubusercontent.com/assets/2462139/22196853/96e456cc-e192-11e6-873a-3a63371107f5.png)


# [Online Demo](http://cstoquer.github.io/modular/)

Nota: Save and Load features are disabled in this demo. 
Patch can be exported (`top menu > Patch > Export patch`), and imported by drag & dropping a patch file in the window.

![construct](https://cloud.githubusercontent.com/assets/2462139/23090673/19d6b99a-f5e7-11e6-9426-d805ed32de74.gif)

# Features

## Built-in buffer editor

![waveedit](https://cloud.githubusercontent.com/assets/2462139/22394204/e3917d2e-e55c-11e6-9ac7-6904c9961e55.png)

View the waveform of the audio buffers.
Edit loop points, tags and properties of the audio files and save these as a meta file.

## Procedural buffer and synth editor

![gif](https://user-images.githubusercontent.com/2462139/28860257-c719a258-7796-11e7-8681-baffa629dcae.gif)

Generate audio buffer with built-in synthesizers, or program your own synth with their own GUI using a simple `SynthEditor` API.

## MIDI support

If your browser supports webMIDI, you can have your MIDI keyboard or controller send events to modules.

![midi](https://cloud.githubusercontent.com/assets/2462139/22738936/ec574c4c-ee4c-11e6-9ff6-c589e8ee1034.png)

## Search audio in the library

Filter the audio files in library by type and tag.

![tag](https://cloud.githubusercontent.com/assets/2462139/23090564/12689672-f5e4-11e6-9af2-830282961982.gif)
