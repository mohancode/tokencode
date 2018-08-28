pragma solidity ^0.4.23;

contract CashFinex {

    uint256 public totalSupply;
    string public name = "CashFinex Token";
    string public symbol = "CFT";
    string public standard = "CashFinex Token v1.0";
    uint256 public decimals = 18;

  event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(uint256 _initialSupply) public
    {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply * 10 ** uint256(decimals);
    }
    /* Internal transfer, only can be called by this contract */
    function _transfer(address _from, address _to, uint _value) internal {
        require (_to != 0x0);                               // Prevent transfer to 0x0 address. Use burn() instead
        require (balanceOf[_from] >= _value);               // Check if the sender has enough
        require (balanceOf[_to] + _value >= balanceOf[_to]); // Check for overflows
        //require(!frozenAccount[_from]);                     // Check if sender is frozen
      //  require(!frozenAccount[_to]);                       // Check if recipient is frozen
        balanceOf[_from] -= _value;                         // Subtract from the sender
        balanceOf[_to] += _value;                           // Add the same to the recipient
        emit Transfer(_from, _to, _value);
    }
    function transfer(address _to, uint256 _value) public returns (bool success){
        _transfer(msg.sender,_to,_value);
        return true;
     }

     function approve(address _spender, uint256 _value) public returns (bool success){

        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
     }

     function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);

        return true;
     }


}
