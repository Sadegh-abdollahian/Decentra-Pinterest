// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SafeMath.sol";
import "./ReentrancyGuard.sol";

contract DecentraPinterest is ReentrancyGuard {
    using SafeMath for uint256;

    // number of uplouded images
    uint256 s_imageCount;
    // contract name
    string public name = "Decentra-Pinterest";

    // map an image to uint256 
    mapping(uint256 => image) public images;

    // struct to store the data of an image
    struct image {
        uint256 id;
        uint256 donateAmount;
        address payable owner;
        string hash; // Can't use bytes32 for the IPFS cid length
        string description;
    }

    // events
    event ImageUploaded(
        uint256 id,
        uint256 donateAmount,
        address payable owner,
        string hash,
        string description
    );

    event ImageDonated(
        uint256 id,
        uint256 donateAmount,
        address payable owner
    );

    /**
     * @dev function to store a new image
     * @param _imageHash hash of user image
     * @param _imageDescription desctiption of user image
     */
    function uploadImage(
        string memory _imageHash,
        string memory _imageDescription
    ) public {
        require(msg.sender != address(0), "uploadImage from zero address");
        require(bytes(_imageDescription).length > 0, "incorrect description");
        require(bytes(_imageHash).length > 0, "incorrect hash");

        s_imageCount = s_imageCount.add(1);
        images[s_imageCount] = image(
            s_imageCount,
            0,
            payable(msg.sender),
            _imageHash,
            _imageDescription
        );

        emit ImageUploaded(
            s_imageCount,
            0,
            payable(msg.sender),
            _imageHash,
            _imageDescription
        );
    }

    /**
     * @dev function for donating the image owner
     * @param _id id of target image
     */
    function donateImageOwner(uint256 _id) public payable nonReentrant {
        require(_id > 0 && _id <= s_imageCount, "Invalid id");

        image memory _image = images[_id];

        address payable _owner = _image.owner;

        (bool sent, ) = _owner.call{value: msg.value}("");
        require(sent, "Falid to send ETH");

        _image.donateAmount = _image.donateAmount.add(msg.value);

        images[_id] = _image;

        emit ImageDonated(s_imageCount, msg.value, payable(msg.sender));
    }

    function getImageFromId(uint256 _id) public view returns (image memory) {
        require(_id > 0 && _id <= s_imageCount, "Invalid id");
        return images[_id];
    }

    function getImageCount() public view returns (uint256) {
        return s_imageCount;
    }
}
