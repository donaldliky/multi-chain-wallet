import React, { useEffect, useState } from 'react';
import { useMoralis, useNewMoralisObject } from "react-moralis";
import { useNavigate } from 'react-router-dom';
import { warnToast, errorToast, successToast } from '../../helper/toast'
import './dashboard.scss'

import { serverUrl, appId, chains } from '../../config/config';

const Dashboard = () => {
  const navigate = useNavigate()
  const { isAuthenticated, logout, Moralis } = useMoralis();
  // state variables
  const [flag, setFlag] = useState(false)
  const [tokensInfo, setTokensInfo] = useState([])

  const [chainName, setChainName] = useState('')
  const [symbol, setSymbol] = useState('')

  const [amount, setAmount] = useState(0)
  const [decimals, setDecimals] = useState(0)
  const [address, setAddress] = useState('')
  const [contract, setContract] = useState('')

  const transferERC20 = async () => {
    if (!(amount && decimals && address && contract)) {
      warnToast('Please check inputs')
      return
    }
    try {
      const options = {
        type: "erc20",
        amount: Moralis.Units.Token(String(amount) || 0, Math.round(decimals)),
        receiver: address,
        contract_address: contract
      }
      const result = await Moralis.transfer(options)
      if (result) {
        successToast("You transfered token successfully")
      } else {
        errorToast("You failed to transfer token")
      }
    } catch (error) {
      console.log(error)
      errorToast("You failed to transfer token")
    }
  }

  const getTransferERC20Balances = async () => {
    try {
      let tempTokenInfos = []
      await Promise.all(chains.map(async (chain) => {
        let tokens = await Moralis.Web3API.account.getTokenBalances({
          chain: chain.name
        })
        tempTokenInfos.push({ tokens, chain: chain.origin })
      }))

      setTokensInfo(tempTokenInfos)
    } catch (error) {
      console.log(error)
      errorToast("Failed to get tokens")
    }
  }

  const fillInputs = (token) => {
    setDecimals(token.decimals)
    setContract(token.token_address)
  }

  const logOut = async () => {
    await logout()
    navigate('/')
  }

  const findMetaData = async () => {
    if (!(chainName && symbol)) {
      warnToast('Please check inputs')
      return
    }

    try {
      let tokens = await Moralis.Web3API.account.getTokenBalances({
        chain: chainName,
      })
      let temp = {}
      tokens.map((token) => {
        if (token.symbol === symbol) {
          temp = token
        }
      })

      if (temp) {
        setContract(temp.token_address)
        setDecimals(temp.decimals)
      } else {
        errorToast("Can't find metadata")
      }
    } catch (error) {
      console.log(error)
      errorToast("Can't find metadata")
    }
  }

  useEffect(() => {
    async function connectToMoralis() {
      if (isAuthenticated) {
        try {
          await Moralis.start({ serverUrl, appId })
        } catch (error) {
          console.log(error)
          navigate('/')
        }
      } else {
        navigate('/')
      }
    }
    connectToMoralis()
  }, [])

  return (
    <div className='dashboardBody'>
      <div className='header'>
        <button className='signout' onClick={logOut}>Sign Out</button>
      </div>
      <div className="center">
        <div className="row">
          <main className="ms-sm-auto">
            <h1 className="text-center">Presend Web Wallet</h1>
            <div className='col-md-12'>
              <div className="">
                <h2>Transfer Tokens</h2>
                <div className="m-3 text-left h6">
                  <p>You may want to play with how this page displays, but here's a quick start guide:<br />
                    - Click 'Get balances'<br />
                    - Click the Transfer button next to the token you want to transfer<br />
                    - Enter the 'amount of tokens' and the 'receiver address'<br />
                    - Hit Presend</p>
                </div>
                <div className="d-flex">
                  <div id="TransferERC20Section" className="container col-md-6">
                    <div className="form-group col-md-12 mb-3">
                      <label htmlFor="ERC20TransferAmount">How many tokens would you like to transfer?</label>
                      <input type="number" step='0.1' className="form-control" placeholder="Eg: 1"
                        value={amount} onChange={(e) => {
                          if (e.target.value >= 0) {
                            setAmount(e.target.value)
                          }
                        }}
                      />
                    </div>
                    <div className="form-group col-md-12 mb-3">
                      <label htmlFor="ERC20TransferAddress">Which address do you want to send the tokens to? </label>
                      <input type="text" className="form-control" placeholder="Receiver address"
                        value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>

                    <div className="form-group col-md-12 mb-3">
                      <label htmlFor="ERC20TransferDecimals">How many decimals does the token you want to send have? </label>
                      <input type="number" step="1" className="form-control" placeholder="Token decimals"
                        value={decimals} onChange={(e) => {
                          if (e.target.value >= 0 && e.target.value <= 18) {
                            setDecimals(e.target.value)
                          }
                        }} />
                    </div>
                    <div className="form-group col-md-12 mb-3">
                      <label htmlFor="ERC20TransferContract">What's the token contract address? </label>
                      <input type="text" className="form-control" placeholder="Token contract address"
                        value={contract} onChange={(e) => setContract(e.target.value)} />
                    </div>
                    <button id="ERC20TransferButton" className="btn btn-primary col-md-12" onClick={transferERC20}>Presend</button>
                  </div>
                  <div className="mt-3 col-md-6">
                    <a className="btn btn-secondary col-md-12" href="#multiCollapseExample1"
                      onClick={() => setFlag(!flag)}
                      role="button">Unsure of contract address
                      or decimals? Click here</a>
                    {
                      flag && (
                        <div className="row">
                          <div className="col-md-12 mt-3">
                            <div className="">
                              <div>
                                <p>Choose the chain you need.</p>
                                <p>We will scan the tokens you have on that chain and retrieve the metadata and put it into the
                                  search for you.</p>
                                <div className="form-group col-md-12 mb-3">
                                  <input type="text" className="form-control" id="ERC20MetadataChain" placeholder="Token chain"
                                    value={chainName} onChange={(e) => setChainName(e.target.value)} />
                                </div>
                                <div className="form-group col-md-12 mb-3">
                                  <input type="text" className="form-control" id="ERC20MetadataSymbol" placeholder="Token symbol"
                                    value={symbol} onChange={(e) => setSymbol(e.target.value)} />
                                </div>
                              </div>
                              <button id="ERC20MetadataSearch" type="submit" className="btn btn-secondary" onClick={findMetaData}>
                                Find Metadata
                              </button>
                              <div id="ERC20Metadata"></div>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  </div>
                </div>
                <hr />
                <div className="tableWidth">
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope='col'>Chain</th>
                          <th scope="col">Name</th>
                          <th scope="col">Symbol</th>
                          <th scope="col">Balance</th>
                          <th scope="col">Decimals</th>
                          <th scope="col">Contract Address</th>
                          <th scope="col">Transfer</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          tokensInfo && tokensInfo.map((chain) => {
                            return (
                              chain.tokens && chain.tokens.map((token, index) => {
                                return <tr key={index}>
                                  <td>{chain.chain}</td>
                                  <td>{token.name}</td>
                                  <td>{token.symbol}</td>
                                  <td>{token.balance / ("1e" + token.decimals)} </td>
                                  <td>{token.decimals}</td>
                                  <td>{token.token_address}</td>
                                  <td><button className="btn btn-primary transfer-button col-md-12" onClick={() => fillInputs(token)}>Transfer&nbsp;{token.symbol}</button></td>
                                </tr>
                              }))
                          })
                        }
                      </tbody>
                    </table>
                    <button onClick={getTransferERC20Balances} className="btn btn-secondary col-md-12">Get balances</button>
                  </div>
                </div>
              </div>
            </div>
          </main >
        </div>
      </div>
    </div>
  )
}

export default Dashboard