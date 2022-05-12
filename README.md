# Simple Javascript signature script

This is a simple javascript script for accepting signatures.

[Click here for demo](http://thomasstadel.dk/signature/)

## How to use

```
<div id="Signature" style="width: 400px; height: 200px; background: #eee; border: 1px solid #ccc;"></div>

<script src="stadel_signature.js"></script>
<script>
    var sign = new StadelSignature('#Signature');
    sign.callbackSigned = () => {
        alert('Thank you for signing');
    }

    function getCroppedImage() {
        document.querySelector('#SignatureImage').src = sign.getCroppedPNG() ?? '';
    }

    function getImage() {
        document.querySelector('#SignatureImage').src = sign.getPNG();
    }
</script>
```

## Callback

As soon as the user finished signing the callbackSigned is triggered.

```
sign.callbackSigned = () => {
    alert('Thank you for signing');
}
```

## Get image data

To get the full image as PNG from the signature canvas, call:

```
sign.getPNG()
```

The function will return the image as an DataURL.

## Get cropped image data

To get the cropped image as PNG from the signature canvas, call:

```
sign.getCroppedPNG()
```

The function will return the image as an DataURL.

