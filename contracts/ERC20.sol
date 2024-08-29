// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;


contract ERC20Token{

    
    mapping(address => uint256) balances;
    mapping(address => mapping(address=> uint256)) private _allowances;

    uint256 private _totalSupply;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);


    constructor(uint256 initialSupply){
        _totalSupply= initialSupply *10**uint256(decimals());
        balances[msg.sender] = _totalSupply;

        emit Transfer(address(0), msg.sender, _totalSupply); // Emit Transfer event
    }

    function name() public pure returns(string memory){
        return "MariusToken";
    }
    function symbol() public pure returns(string memory){
        return "MAR";
    }
    function decimals() public pure returns(uint8){
        return 18;
    }

    function totalSupply() public view returns (uint256){return _totalSupply;}
    
    function balanceOf(address _owner) public view returns (uint256 balance){
        return balances[_owner];
        }

    function transfer(address to, uint256 value) public returns (bool success){
        require(balances[msg.sender] >= value,"Insufficient Tokens!");
        
        balances[msg.sender] -= value;
        balances[to] += value;

        emit Transfer(msg.sender,to,value);

        return true;
        }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
         require(_allowances[_from][msg.sender] >= _value, "The address didn't allow you to spend this much!!!");
        balances[_from]-= _value;
        balances[_to]+= _value;
        _allowances[_from][msg.sender]-= _value;

        emit Transfer(_from,_to,_value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success){
    
    _allowances[msg.sender][_spender] = _value;

    emit Approval(msg.sender,_spender,_value);
    return true;
    
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining){
        return _allowances[_owner][_spender];
    }
}